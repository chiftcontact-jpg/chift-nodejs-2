import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, User, Mail, Phone, Shield, MapPin, CreditCard, Globe, 
  ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2,
  GraduationCap, Briefcase, PlusCircle, Heart, Droplet,
  FileText, Activity, Home
} from 'lucide-react';
import { userAPI } from '../lib/api';
import type { UtilisateurFormData, BeneficiaireFormData } from '../components/NouvelUtilisateurModal';

const createEmptyBeneficiaire = (): BeneficiaireFormData => ({
  nom: '',
  prenom: '',
  dateNaissance: '',
  lienParente: ''
});

export const NouvelAdherentPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<UtilisateurFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nationalite: '',
    villeResidence: '',
    adresse: '',
    region: '',
    departement: '',
    commune: '',
    dateNaissance: '',
    groupeSanguin: '',
    cni: '',
    niveauEducation: '',
    niveauEducationAutre: '',
    profession: '',
    role: '',
    leket: {
      souscrit: false,
      jourCotisation: '',
      montantParts: 0,
      nombreParts: 0,
      evenementButoir: {
        mois: '',
        annee: ''
      },
      joursAvantButoir: 1
    },
    csu: {
      souscrit: false,
      nombreBeneficiaires: 0,
      medecinTrouve: false,
      pharmacieTrouvee: false,
      lettreGarantie: false,
      autres: ''
    },
    adhesion: {
      date: new Date().toISOString().split('T')[0],
      numero: '',
      nomMSD: '',
      communeMSD: ''
    },
    beneficiaires: [createEmptyBeneficiaire()]
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const steps = [
    'Contact',
    'Identité',
    'Profession',
    'Bénéficiaires',
    'LEKET',
    'CSU',
    'Adhésion',
    'Rôle'
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value);
    
    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      setFormData(prev => {
        if (grandChild) {
          return {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof UtilisateurFormData] as any),
              [child]: {
                ...(prev[parent as keyof UtilisateurFormData] as any)[child],
                [grandChild]: val
              }
            }
          };
        }
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof UtilisateurFormData] as any),
            [child]: val
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: val
      }));
    }
    
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const handleBeneficiaireChange = (index: number, field: keyof BeneficiaireFormData, value: string) => {
    setFormData(prev => {
      const beneficiaires = [...prev.beneficiaires];
      beneficiaires[index] = { ...beneficiaires[index], [field]: value };
      return { ...prev, beneficiaires };
    });
  };

  const handleAddBeneficiaire = () => {
    setFormData(prev => ({
      ...prev,
      beneficiaires: [...prev.beneficiaires, createEmptyBeneficiaire()]
    }));
  };

  const validateStep = () => {
    const newErrors: any = {};
    if (currentStep === 0) {
      if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
      if (!formData.nom) newErrors.nom = 'Le nom est requis';
      if (!formData.telephone) newErrors.telephone = 'Le téléphone est requis';
    }
    if (currentStep === 4 && formData.leket.souscrit) {
      if (!formData.leket.jourCotisation) newErrors['leket.jourCotisation'] = 'Le jour est requis';
      if (!formData.leket.montantParts) newErrors['leket.montantParts'] = 'Le montant est requis';
      if (!formData.leket.nombreParts) newErrors['leket.nombreParts'] = 'Le nombre est requis';
    }
    if (currentStep === 7) {
      if (!formData.role) newErrors.role = 'Le rôle est requis';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep() && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        username: formData.email ? formData.email.split('@')[0] : `adh-${Date.now()}`,
        email: formData.email || `adh-${Date.now()}@chift.sn`,
        password: 'Password123!',
        rolePrincipal: formData.role,
        ...formData
      };

      const response = await userAPI.create(payload);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/utilisateurs'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Prénom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all ${formErrors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} placeholder="Ex: Moussa" />
                </div>
                {formErrors.prenom && <p className="text-xs text-red-500">{formErrors.prenom}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all ${formErrors.nom ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} placeholder="Ex: Diop" />
                </div>
                {formErrors.nom && <p className="text-xs text-red-500">{formErrors.nom}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="moussa.diop@exemple.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Téléphone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all ${formErrors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} placeholder="77 000 00 00" />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-600" />
                Identité & Santé
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Date de Naissance</label>
                  <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nationalité</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="nationalite" value={formData.nationalite} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ex: Sénégalaise" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Groupe Sanguin</label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select name="groupeSanguin" value={formData.groupeSanguin} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                      <option value="">Sélectionner</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">CNI</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="cni" value={formData.cni} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Numéro CNI" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Home className="w-6 h-6 text-teal-600" />
                Localisation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Région</label>
                  <select name="region" value={formData.region} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                    <option value="">Sélectionner une région</option>
                    {['DAKAR', 'THIES', 'DIOURBEL', 'LOUGA', 'SAINT-LOUIS', 'KAOLACK', 'FATICK', 'KAFFRINE', 'KOLDA', 'MATAM', 'SEDHIOU', 'TAMBACOUNDA', 'ZIGUINCHOR', 'KEDOUGOU'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Département</label>
                  <input type="text" name="departement" value={formData.departement} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ex: Dakar" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Adresse Complète</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea name="adresse" value={formData.adresse} onChange={handleChange} rows={2} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Quartier, Rue, Porte..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informations professionnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Niveau d'éducation</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select name="niveauEducation" value={formData.niveauEducation} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                    <option value="">Sélectionner</option>
                    {['Aucun', 'Primaire', 'Collège', 'Lycée', 'Bac', 'Licence', 'Master', 'Doctorat', 'Coraniques', 'Alphabétisation', 'AUTRE'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Profession</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ex: Commerçant" />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bénéficiaires</h3>
              <button type="button" onClick={handleAddBeneficiaire} className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 font-semibold rounded-lg hover:bg-teal-100 transition-all">
                <PlusCircle className="w-5 h-5" />
                Ajouter
              </button>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prénom</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lien</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.beneficiaires.map((b, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><input type="text" value={b.prenom} onChange={(e) => handleBeneficiaireChange(i, 'prenom', e.target.value)} className="w-full border-0 focus:ring-0 p-0 text-sm" placeholder="Prénom" /></td>
                      <td className="px-4 py-3"><input type="text" value={b.nom} onChange={(e) => handleBeneficiaireChange(i, 'nom', e.target.value)} className="w-full border-0 focus:ring-0 p-0 text-sm" placeholder="Nom" /></td>
                      <td className="px-4 py-3">
                        <select value={b.lienParente} onChange={(e) => handleBeneficiaireChange(i, 'lienParente', e.target.value)} className="w-full border-0 focus:ring-0 p-0 text-sm bg-transparent">
                          <option value="">Lien</option>
                          {['Conjoint(e)', 'Enfant', 'Parent', 'Frère/Sœur', 'Autre'].map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 p-6 bg-teal-50 rounded-2xl border border-teal-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <CreditCard className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-teal-900">Souscription au compte LEKET</h3>
                <p className="text-sm text-teal-700">Activez l'épargne programmée pour cet adhérent</p>
              </div>
              <div className="ml-auto">
                <input type="checkbox" name="leket.souscrit" checked={formData.leket.souscrit} onChange={handleChange} className="w-6 h-6 text-teal-600 rounded-lg border-teal-200 focus:ring-teal-500" />
              </div>
            </div>

            {formData.leket.souscrit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-gray-100 rounded-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Jour de cotisation</label>
                  <select name="leket.jourCotisation" value={formData.leket.jourCotisation} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                    <option value="">Sélectionner</option>
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Montant des parts (FCFA)</label>
                  <input type="number" name="leket.montantParts" value={formData.leket.montantParts} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ex: 5000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nombre de parts</label>
                  <input type="number" name="leket.nombreParts" value={formData.leket.nombreParts} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ex: 2" />
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">Couverture Sanitaire Universelle (CSU)</h3>
                <p className="text-sm text-blue-700">Adhésion au programme de santé communautaire</p>
              </div>
              <div className="ml-auto">
                <input type="checkbox" name="csu.souscrit" checked={formData.csu.souscrit} onChange={handleChange} className="w-6 h-6 text-blue-600 rounded-lg border-blue-200 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Détails d'adhésion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date d'adhésion</label>
                <input type="date" name="adhesion.date" value={formData.adhesion.date} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Numéro d'adhésion</label>
                <input type="text" name="adhesion.numero" value={formData.adhesion.numero} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Numéro unique" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nom de la MSD</label>
                <input type="text" name="adhesion.nomMSD" value={formData.adhesion.nomMSD} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Nom de la MSD" />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-teal-600" />
              Attribution du rôle
            </h3>
            <div className="max-w-md p-6 border border-gray-100 rounded-2xl">
              <label className="block text-sm font-bold text-gray-700 mb-4">Sélectionnez le rôle de l'utilisateur</label>
              <div className="space-y-3">
                {[
                  { id: 'UTILISATEUR', label: 'Adhérent', desc: 'Accès standard aux services' },
                  { id: 'MAKER', label: 'Maker', desc: 'Saisie et création de données' },
                  { id: 'AGENT', label: 'Agent', desc: 'Gestion opérationnelle terrain' },
                  { id: 'SUPERVISEUR', label: 'Superviseur', desc: 'Contrôle et validation' },
                  { id: 'ADMIN', label: 'Administrateur', desc: 'Gestion complète du système' }
                ].map(r => (
                  <label key={r.id} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.role === r.id ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200' : 'border-gray-100 hover:border-teal-200'}`}>
                    <input type="radio" name="role" value={r.id} checked={formData.role === r.id} onChange={handleChange} className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500" />
                    <div>
                      <p className="font-bold text-gray-900">{r.label}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {formErrors.role && <p className="mt-2 text-sm text-red-500 font-medium">{formErrors.role}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header fixe */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/utilisateurs')} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
                      <h1 className="text-xl font-black text-gray-900 tracking-tight">Nouvel Adhérent</h1>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Étape {currentStep + 1} sur {steps.length}</p>
                    </div>
          </div>
          <div className="flex items-center gap-3">
            {isLastStep ? (
              <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold rounded-xl shadow-lg shadow-teal-100 transition-all">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Enregistrer
              </button>
            ) : (
              <button onClick={handleNextStep} className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all">
                Continuer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation latérale */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 space-y-1">
              {steps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => index < currentStep ? setCurrentStep(index) : null}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                    index === currentStep 
                      ? 'bg-teal-600 text-white shadow-xl shadow-teal-100' 
                      : index < currentStep 
                        ? 'text-teal-600 hover:bg-teal-50' 
                        : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border-2 ${
                    index === currentStep ? 'border-white bg-white/20' : index < currentStep ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="font-bold text-sm">{step}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire central */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl p-4 sm:p-10 border border-gray-100 shadow-2xl shadow-gray-100/50">
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-bold">Adhérent créé avec succès ! Redirection...</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                <div className="mt-12 flex items-center justify-between">
                  <button type="button" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={isFirstStep} className={`px-6 py-3 font-bold text-gray-400 hover:text-gray-600 transition-all ${isFirstStep ? 'opacity-0' : 'opacity-100'}`}>
                    Retour
                  </button>
                  {!isLastStep && (
                    <button type="button" onClick={handleNextStep} className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl shadow-xl shadow-teal-100 transition-all">
                      Étape suivante
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

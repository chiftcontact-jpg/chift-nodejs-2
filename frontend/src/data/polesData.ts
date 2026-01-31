
export interface PoleData {
  id: string;
  nom: string;
  regions: string[];
  population: string;
  pib: string;
  tauxEmploi: string;
  potentiels: string[];
  couleur: string;
  pointsForts: string[];
}

export const POLES_TERRITOIRES_DATA: Record<string, PoleData> = {
  "OUEST": {
    id: "OUEST",
    nom: "Pôle Ouest",
    regions: ["Dakar", "Thiès", "Mbour"],
    population: "6.5 M",
    pib: "4.9 M FCFA/hab",
    tauxEmploi: "40%",
    potentiels: [
      "Services à valeur ajoutée",
      "Capitale mondiale de la mode et de la culture africaine",
      "Métropole tourisme d'affaires",
      "Pôle régional de formation, recherche et innovation",
      "Pôle IAA, industrie manufacturière et assemblage"
    ],
    couleur: "#0E7490", // Cyan/Blue
    pointsForts: ["ZES Diamniadio", "Ville pétrochimique", "Plateforme logistique"]
  },
  "NORD": {
    id: "NORD",
    nom: "Pôle Nord",
    regions: ["Saint-Louis", "Louga", "Matam"],
    population: "2.4 M",
    pib: "2.8 M FCFA/hab",
    tauxEmploi: "43%",
    potentiels: [
      "Grenier agricole du Sahel (riz, céréales, sucre)",
      "Pêche et aquaculture",
      "Tourisme (culturel, écotourisme)",
      "Hydrocarbures et énergie"
    ],
    couleur: "#10B981", // Emerald
    pointsForts: ["Agropole Nord", "Gazoduc/Oléoduc"]
  },
  "NORD_EST": {
    id: "NORD_EST",
    nom: "Pôle Nord-Est",
    regions: ["Matam", "Ranérou"],
    population: "2.3 M",
    pib: "3.9 M FCFA/hab",
    tauxEmploi: "39%",
    potentiels: [
      "Pôle industriel Phosphates-Engrais",
      "Élevage intensif (viande & lait)",
      "Produits Forestiers Non Ligneux (Grande Muraille Verte)"
    ],
    couleur: "#F59E0B", // Amber
    pointsForts: ["ZI phosphates et engrais"]
  },
  "CENTRE_OUEST": {
    id: "CENTRE_OUEST",
    nom: "Pôle Centre-Ouest",
    regions: ["Diourbel", "Fatick", "Kaolack"],
    population: "7.1 M",
    pib: "1 M FCFA/hab",
    tauxEmploi: "29%",
    potentiels: [
      "Grande agglomération Touba-Mbacké (> 3M hab)",
      "Tourisme religieux",
      "IAA et industrie manufacturière"
    ],
    couleur: "#065F46", // Dark Green
    pointsForts: ["Agropole Ouest", "Plateforme logistique"]
  },
  "SUD_WEST": {
    id: "SUD_WEST",
    nom: "Pôle Sud-Ouest",
    regions: ["Ziguinchor", "Kolda", "Sédhiou"],
    population: "5.4 M",
    pib: "1.8 M FCFA/hab",
    tauxEmploi: "40%",
    potentiels: [
      "Grenier agricole et pôle agro-industriel (fruits, céréales, anacarde)",
      "Tourisme (écotourisme, culturel)",
      "Plateforme logistique du Sud"
    ],
    couleur: "#047857", // Green
    pointsForts: ["Agropole Sud", "Plateforme logistique"]
  },
  "CENTRE_EST": {
    id: "CENTRE_EST",
    nom: "Pôle Centre-Est",
    regions: ["Kaffrine", "Tambacounda"],
    population: "3.1 M",
    pib: "4 M FCFA/hab",
    tauxEmploi: "43%",
    potentiels: [
      "Plateforme logistique régionale (Tambacounda)",
      "Ecotourisme (Niokolo-Koba, pays Bassari)",
      "IAA / Agropole Est (céréales, bananes, coton)",
      "Hub métallurgique régional"
    ],
    couleur: "#B45309", // Brownish/Amber
    pointsForts: ["Agropole Est", "Hub métallurgique"]
  },
  "SUD_EST": {
    id: "SUD_EST",
    nom: "Pôle Sud-Est",
    regions: ["Kédougou"],
    population: "3.1 M",
    pib: "4 M FCFA/hab",
    tauxEmploi: "43%",
    potentiels: [
      "Exploitation minière (Or, Fer)",
      "Écotourisme (Niokolo-Koba)",
      "Développement économique frontalier"
    ],
    couleur: "#7F1D1D", // Maroon/Red
    pointsForts: ["Mines", "Niokolo-Koba"]
  },
  "CENTRE": {
    id: "CENTRE",
    nom: "Pôle Centre",
    regions: ["Kaffrine", "Fatick", "Kaolack"],
    population: "7.6 M",
    pib: "1.6 M FCFA/hab",
    tauxEmploi: "44%",
    potentiels: [
      "Pôle agro-industriel Agropole centre (arachide, sel)",
      "Carrefour logistique (Kaolack)",
      "Ecotourisme et Loisirs",
      "Tourisme religieux"
    ],
    couleur: "#D97706", // Orange/Amber
    pointsForts: ["Agropole Centre", "Carrefour logistique"]
  }
};

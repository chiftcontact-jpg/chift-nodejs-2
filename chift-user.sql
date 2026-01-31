-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : mar. 27 jan. 2026 à 17:23
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `chift-user`
--

-- --------------------------------------------------------

--
-- Structure de la table `beneficiary`
--

CREATE TABLE `beneficiary` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `relationship` enum('CHILD','FAMILY','PARENT','SIBLING','SPOUSE') DEFAULT NULL,
  `user_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fiche_services_transfert_details`
--

CREATE TABLE `fiche_services_transfert_details` (
  `fiche_id` bigint NOT NULL,
  `service_detail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fiche_souscription`
--

CREATE TABLE `fiche_souscription` (
  `id` bigint NOT NULL,
  `autre_service_transfert` varchar(255) DEFAULT NULL,
  `compte_bancaire` varchar(255) DEFAULT NULL,
  `credit_tiers` varchar(255) DEFAULT NULL,
  `details_credit` varchar(255) DEFAULT NULL,
  `encours_credit` varchar(255) DEFAULT NULL,
  `institution_credit` varchar(255) DEFAULT NULL,
  `methode_recouvrement` varchar(255) DEFAULT NULL,
  `montant_tontines` varchar(255) DEFAULT NULL,
  `participation_tontines` varchar(255) DEFAULT NULL,
  `preference_transactions` varchar(255) DEFAULT NULL,
  `services_transfert` varchar(255) DEFAULT NULL,
  `tableau_amortissement` varchar(255) DEFAULT NULL,
  `type_pret` enum('CAISSE','CHIFT') DEFAULT NULL,
  `user_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `access_token_expiration` datetime(6) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `assigned_locality_id` bigint DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `cni_number` varchar(255) DEFAULT NULL,
  `contenu_qr_code` varchar(255) DEFAULT NULL,
  `education_level` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `groupe_sanguin` varchar(255) DEFAULT NULL,
  `id_supervised_ass` bigint DEFAULT NULL,
  `is_supervisor` bit(1) DEFAULT NULL,
  `keycloak_id` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `numero_adhesion` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_expiration` datetime(6) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `saving_id` bigint DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `created_at`, `updated_at`, `access_token`, `access_token_expiration`, `activity`, `address`, `assigned_locality_id`, `birth_date`, `birth_place`, `city`, `cni_number`, `contenu_qr_code`, `education_level`, `email`, `first_name`, `groupe_sanguin`, `id_supervised_ass`, `is_supervisor`, `keycloak_id`, `last_name`, `nationality`, `numero_adhesion`, `otp`, `otp_expiration`, `phone`, `qr_code`, `saving_id`, `whatsapp`) VALUES
(1, '2026-01-27 17:22:02.076000', '2026-01-27 17:22:02.076000', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'admin@chift.com', 'Admin', NULL, NULL, NULL, '78d5ad07-4727-4c5d-b19b-7341d43d0faa', 'Chift', NULL, NULL, NULL, NULL, '+221770000000', NULL, NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `beneficiary`
--
ALTER TABLE `beneficiary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKgtwfi6r68gyaju6py7rkfisml` (`user_id`);

--
-- Index pour la table `fiche_services_transfert_details`
--
ALTER TABLE `fiche_services_transfert_details`
  ADD KEY `FK7in1ttx8l9onxwxri61934w59` (`fiche_id`);

--
-- Index pour la table `fiche_souscription`
--
ALTER TABLE `fiche_souscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5vp5b1vi5swjrphyldhrq37hb` (`user_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK589idila9li6a4arw1t8ht1gx` (`phone`),
  ADD UNIQUE KEY `UKb4owaoonqrk1l7hrk0ucu1grk` (`whatsapp`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `beneficiary`
--
ALTER TABLE `beneficiary`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fiche_souscription`
--
ALTER TABLE `fiche_souscription`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `beneficiary`
--
ALTER TABLE `beneficiary`
  ADD CONSTRAINT `FKgtwfi6r68gyaju6py7rkfisml` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `fiche_services_transfert_details`
--
ALTER TABLE `fiche_services_transfert_details`
  ADD CONSTRAINT `FK7in1ttx8l9onxwxri61934w59` FOREIGN KEY (`fiche_id`) REFERENCES `fiche_souscription` (`id`);

--
-- Contraintes pour la table `fiche_souscription`
--
ALTER TABLE `fiche_souscription`
  ADD CONSTRAINT `FKa2hqp7gcaxrcssecmss8i4vra` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

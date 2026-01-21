#!/bin/bash
# Script pour corriger les problèmes de linting Markdown

echo "🔧 Correction des fichiers Markdown..."

# Correction automatique avec markdownlint-cli2
npx markdownlint-cli2-fix "*.md" "#docs" || echo "markdownlint-cli2 non disponible, correction manuelle..."

# Vérification finale
echo "✅ Vérification finale..."
npx markdownlint-cli2 "*.md" "#docs" || echo "Certains problèmes persistent"

echo "🎯 Correction terminée !"

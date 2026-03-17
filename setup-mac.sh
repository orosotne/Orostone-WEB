#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

step() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${GREEN}▶ $1${NC}"; echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }
info()  { echo -e "${YELLOW}  ℹ $1${NC}"; }
ok()    { echo -e "${GREEN}  ✓ $1${NC}"; }
err()   { echo -e "${RED}  ✗ $1${NC}"; }

# ──────────────────────────────────────────
# KROK 1: Homebrew
# ──────────────────────────────────────────
step "KROK 1/7: Instalacia Homebrew"

if command -v brew &>/dev/null; then
    ok "Homebrew uz je nainstalovany: $(brew --version | head -1)"
else
    info "Spustam instalaciu Homebrew (bude treba zadat heslo)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Pridanie do PATH pre Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
        ok "Homebrew nainstalovany a pridany do PATH"
    else
        err "Homebrew sa nenaintaloval spravne"
        exit 1
    fi
fi

# Overenie
brew --version
echo ""

# ──────────────────────────────────────────
# KROK 2: nvm + Node.js
# ──────────────────────────────────────────
step "KROK 2/7: Instalacia nvm + Node.js"

brew install nvm

mkdir -p "$HOME/.nvm"

# nvm config do .zshrc (ak este nie je)
if ! grep -q 'NVM_DIR' ~/.zshrc 2>/dev/null; then
    cat >> ~/.zshrc << 'ZSHRC_NVM'

# nvm (Node Version Manager)
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
ZSHRC_NVM
    ok "nvm config pridany do ~/.zshrc"
fi

# Nacitat nvm hned
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"

info "Instalujem Node.js LTS..."
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

ok "Node.js: $(node -v)"
ok "npm: $(npm -v)"
echo ""

# ──────────────────────────────────────────
# KROK 3: Shell konfiguracia (.zshrc)
# ──────────────────────────────────────────
step "KROK 3/7: Shell konfiguracia"

# Zakladne aliasy (ak este nie su)
if ! grep -q '# Dev aliases' ~/.zshrc 2>/dev/null; then
    cat >> ~/.zshrc << 'ZSHRC_ALIASES'

# Dev aliases
alias ll="ls -la"
alias la="ls -A"
alias ..="cd .."
alias ...="cd ../.."
alias gs="git status"
alias gd="git diff"
alias gl="git log --oneline -20"
alias gp="git push"
alias gc="git commit"
alias dev="npm run dev"
alias build="npm run build"
ZSHRC_ALIASES
    ok "Aliasy pridane do ~/.zshrc"
else
    ok "Aliasy uz existuju v ~/.zshrc"
fi

echo ""

# ──────────────────────────────────────────
# KROK 4: SSH kluc pre GitHub
# ──────────────────────────────────────────
step "KROK 4/7: SSH kluc pre GitHub"

if [[ -f ~/.ssh/id_ed25519 ]]; then
    ok "SSH kluc uz existuje"
else
    info "Generujem novy SSH kluc..."
    ssh-keygen -t ed25519 -C "martinmiskeje@gmail.com" -f ~/.ssh/id_ed25519 -N ""
    eval "$(ssh-agent -s)"

    # Pridat do ssh-agent config
    if [[ ! -f ~/.ssh/config ]]; then
        cat > ~/.ssh/config << 'SSH_CONFIG'
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
SSH_CONFIG
    fi

    ssh-add --apple-use-keychain ~/.ssh/id_ed25519 2>/dev/null || ssh-add ~/.ssh/id_ed25519

    ok "SSH kluc vygenerovany"
    echo ""
    echo -e "${YELLOW}  ╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}  ║  DÔLEŽITÉ: Pridaj SSH kľúč na GitHub!                   ║${NC}"
    echo -e "${YELLOW}  ║                                                          ║${NC}"
    echo -e "${YELLOW}  ║  1. Kľúč je skopírovaný do schránky (Cmd+V)             ║${NC}"
    echo -e "${YELLOW}  ║  2. Choď na: github.com/settings/keys                   ║${NC}"
    echo -e "${YELLOW}  ║  3. Klikni 'New SSH key' a vlož kľúč                    ║${NC}"
    echo -e "${YELLOW}  ╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    pbcopy < ~/.ssh/id_ed25519.pub
    info "Verejny kluc (skopirovany do schranky):"
    cat ~/.ssh/id_ed25519.pub
fi

echo ""

# ──────────────────────────────────────────
# KROK 5: CLI nastroje
# ──────────────────────────────────────────
step "KROK 5/7: Uzitocne CLI nastroje"

TOOLS="git gh ripgrep jq wget tree"
info "Instalujem: $TOOLS"
brew install $TOOLS

ok "git:     $(git --version)"
ok "gh:      $(gh --version | head -1)"
ok "ripgrep: $(rg --version | head -1)"
ok "jq:      $(jq --version)"

echo ""

# ──────────────────────────────────────────
# KROK 6: Programatorsky font
# ──────────────────────────────────────────
step "KROK 6/7: Programatorsky font"

brew install --cask font-jetbrains-mono
ok "JetBrains Mono nainstalovany"
info "Nastav ho v Cursor: Settings > font family > 'JetBrains Mono'"

echo ""

# ──────────────────────────────────────────
# KROK 7: Projekt Orostone
# ──────────────────────────────────────────
step "KROK 7/7: Setup projektu Orostone"

PROJECT_DIR="/Users/martinmiskeje/Documents/Projekty_Cursor/Orostone-WEB"
if [[ -d "$PROJECT_DIR" ]]; then
    cd "$PROJECT_DIR"
    info "Spustam npm install..."
    npm install
    ok "Dependencie nainstalovane"
    echo ""
    info "Teraz mozes spustit server:"
    echo -e "  ${GREEN}cd $PROJECT_DIR${NC}"
    echo -e "  ${GREEN}npm run dev${NC}"
    echo -e "  Potom otvor: ${GREEN}http://localhost:3000${NC}"
else
    err "Priecinok $PROJECT_DIR neexistuje"
fi

echo ""

# ──────────────────────────────────────────
# ZHRNUTIE
# ──────────────────────────────────────────
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  HOTOVO! Setup dokonceny.${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} Homebrew"
echo -e "  ${GREEN}✓${NC} Node.js $(node -v) + npm $(npm -v)"
echo -e "  ${GREEN}✓${NC} SSH kluc pre GitHub"
echo -e "  ${GREEN}✓${NC} CLI nastroje (git, gh, rg, jq, wget, tree)"
echo -e "  ${GREEN}✓${NC} Font JetBrains Mono"
echo -e "  ${GREEN}✓${NC} Projekt Orostone - dependencie nainstalovane"
echo ""
echo -e "  ${YELLOW}Nezabudni:${NC}"
echo -e "  1. Pridaj SSH kluc na GitHub (github.com/settings/keys)"
echo -e "  2. Restartuj terminal (alebo spusti: source ~/.zshrc)"
echo -e "  3. V Cursori nastav font: JetBrains Mono"
echo ""

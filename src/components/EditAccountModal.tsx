import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Users, 
  UserCheck, 
  Grid, 
  Image, 
  RefreshCw, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { InstagramAccount } from '../types';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: InstagramAccount;
  onSaveAccount: (updatedAccount: InstagramAccount) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaveAccount,
}) => {
  const [username, setUsername] = useState(account.username || '');
  const [displayName, setDisplayName] = useState(account.displayName || '');
  const [followers, setFollowers] = useState<number>(account.followers || 0);
  const [following, setFollowing] = useState<number>(account.following || 0);
  const [postsCount, setPostsCount] = useState<number>(account.postsCount || 0);
  const [avatar, setAvatar] = useState(account.avatar || '');
  const [copiedSyncScript, setCopiedSyncScript] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUser = username.trim().replace(/^@/, '');
    const updated: InstagramAccount = {
      ...account,
      username: cleanUser || account.username,
      displayName: displayName.trim() || `@${cleanUser}`,
      followers: Number(followers) || 0,
      following: Number(following) || 0,
      postsCount: Number(postsCount) || 0,
      avatar: avatar.trim() || account.avatar,
      isRealAccount: true,
    };

    onSaveAccount(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  // Script to auto-extract info directly from the user's logged-in Instagram tab
  const syncScript = `/** Cole no Console (F12) da sua aba do Instagram para sincronizar automaticamente com o AutoInsta **/
(function syncToAutoInsta() {
  const username = '${account.username}';
  let followers = 0;
  let following = 0;
  let posts = 0;
  let avatarUrl = '';
  
  // Tenta extrair da página do perfil
  const headerLinks = Array.from(document.querySelectorAll('header section ul li, header section a'));
  headerLinks.forEach(el => {
    const text = el.innerText || '';
    if (text.includes('seguidor') || text.includes('follower')) {
      const match = text.match(/([0-9.,]+)/);
      if (match) followers = parseInt(match[1].replace(/\\D/g, ''));
    }
    if (text.includes('seguindo') || text.includes('following')) {
      const match = text.match(/([0-9.,]+)/);
      if (match) following = parseInt(match[1].replace(/\\D/g, ''));
    }
    if (text.includes('publicaç') || text.includes('post')) {
      const match = text.match(/([0-9.,]+)/);
      if (match) posts = parseInt(match[1].replace(/\\D/g, ''));
    }
  });

  const img = document.querySelector('header img');
  if (img) avatarUrl = img.src;

  console.log('[AutoInsta] Dados reais encontrados no seu Instagram:', { username, followers, following, posts, avatarUrl });

  // Envia para o painel do AutoInsta
  fetch('${window.location.origin}/api/instagram/sync-from-browser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      followers,
      following,
      postsCount: posts,
      avatar: avatarUrl
    })
  }).then(r => r.json()).then(res => {
    alert('✅ AutoInsta: Dados reais de @' + username + ' sincronizados com sucesso!');
  }).catch(err => {
    console.error(err);
    alert('Pronto! Dados copiados. Atualize os campos no painel: Seguidores: ' + followers + ' | Seguindo: ' + following);
  });
})();`;

  const copySyncScript = () => {
    navigator.clipboard.writeText(syncScript);
    setCopiedSyncScript(true);
    setTimeout(() => setCopiedSyncScript(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Definir Dados Reais da Conta @{account.username}
              </h2>
              <p className="text-xs text-neutral-400">
                Ajuste os números e informações exatas do seu perfil do Instagram
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick sync helper */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-start justify-between gap-3">
            <div>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                Sincronização Direta da sua aba do Instagram
              </span>
              <p className="text-neutral-400 mt-1 text-[11px]">
                Copie o script e cole no Console (F12) da sua aba do Instagram onde você já está logado para capturar tudo automaticamente.
              </p>
            </div>
            <button
              type="button"
              onClick={copySyncScript}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px] font-medium transition-colors"
            >
              {copiedSyncScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSyncScript ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Nome de Usuário (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Nome de Exibição</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ex: Naturalis Gourmet"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Seguidores</span>
              </label>
              <input
                type="number"
                min="0"
                value={followers}
                onChange={(e) => setFollowers(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Seguindo</span>
              </label>
              <input
                type="number"
                min="0"
                value={following}
                onChange={(e) => setFollowing(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-medium flex items-center gap-1">
                <Grid className="w-3.5 h-3.5 text-amber-400" />
                <span>Publicações</span>
              </label>
              <input
                type="number"
                min="0"
                value={postsCount}
                onChange={(e) => setPostsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-amber-400" />
              <span>URL da Foto de Perfil (Avatar)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://... ou caminho da imagem"
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
              {avatar && (
                <img
                  src={avatar}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-neutral-700 flex-shrink-0"
                />
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <span>
              Ao salvar, esses dados reais serão refletidos em todo o painel, nos relatórios de crescimento e no cálculo de limites seguros da conta.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-lg shadow transition-colors"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Salvo!' : 'Salvar Dados Reais'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

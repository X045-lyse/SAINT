
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, Sparkles, Share2, ExternalLink } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const CreateView: React.FC = () => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender || !recipient || !message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase
        .from('love_letters')
        .insert({ sender, recipient, message })
        .select('id')
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error('Missing id');

      const baseUrl = window.location.origin + window.location.pathname;
      const link = `${baseUrl}#id=${encodeURIComponent(data.id)}`;
      setGeneratedLink(link);
    } catch (err) {
      console.error('Erreur de création Supabase:', err);
      setSubmitError("Impossible de générer le lien pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Un message secret pour toi... ❤️',
          text: `Coucou ${recipient}, j'ai quelque chose à te demander...`,
          url: generatedLink,
        });
      } catch (err) {
        console.log('Erreur de partage:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50"
    >
      <div className="text-center mb-8">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block p-4 bg-[#FF4D6D]/10 rounded-full mb-4"
        >
          <Heart className="w-12 h-12 text-[#E63946] fill-[#E63946]" />
        </motion.div>
        <h1 className="text-4xl font-romantic text-[#E63946] font-bold mb-2">Crée ton lien magique ❤️</h1>
        <p className="text-gray-600">Surprends ton/ta Valentin(e) avec une demande inoubliable.</p>
      </div>

      {!generatedLink ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ton prénom</label>
              <input 
                type="text" 
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Ex: Thomas"
                className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom de ton/ta Valentin(e)</label>
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ex: Emma"
                className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ta lettre d'amour</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écris quelque chose de doux qui s'affichera seulement s'il/elle dit OUI..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition outline-none resize-none"
              required
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-600 font-semibold">
              {submitError}
            </p>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E63946] hover:bg-[#FF4D6D] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isSubmitting ? 'Génération...' : 'Générer le lien magique ❤️'}
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center"
        >
          <div className="p-6 bg-green-50 border border-green-100 rounded-2xl">
            <h2 className="text-xl font-bold text-green-800 mb-2">Lien prêt ! ✨</h2>
            <p className="text-sm text-green-700 mb-4">Ce lien contient ton message secret. Partage-le maintenant !</p>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-pink-200 shadow-inner">
                <input 
                  type="text" 
                  readOnly 
                  value={generatedLink}
                  className="flex-grow bg-transparent text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap px-2"
                />
                <button 
                  onClick={copyToClipboard}
                  className="bg-[#FF4D6D] text-white p-2 rounded-md hover:bg-[#E63946] transition flex items-center gap-1 text-sm font-semibold whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={shareLink}
                  className="flex items-center justify-center gap-2 bg-[#E63946] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#FF4D6D] transition shadow-md"
                >
                  <Share2 className="w-5 h-5" />
                  Envoyer / Partager
                </button>
                <a 
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-[#E63946] border-2 border-[#E63946] py-3 px-4 rounded-xl font-bold hover:bg-red-50 transition shadow-sm"
                >
                  <ExternalLink className="w-5 h-5" />
                  Tester le lien
                </a>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setGeneratedLink('')}
            className="text-[#FF4D6D] text-sm font-semibold hover:underline"
          >
            Modifier ma lettre
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateView;

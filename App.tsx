
import React, { useState, useEffect } from 'react';
import { decodeLetter } from './utils/linkUtils';
import CreateView from './views/CreateView';
import ReceiveView from './views/ReceiveView';
import FloatingHearts from './components/FloatingHearts';
import { LoveLetterData } from './types';
import { supabase, supabaseConfigError } from './utils/supabaseClient';

const App: React.FC = () => {
  const [data, setData] = useState<LoveLetterData | null>(null);
  const [view, setView] = useState<'CREATE' | 'RECEIVE'>('CREATE');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchLetterById = async (id: string) => {
    if (!supabase) {
      setLoadError(supabaseConfigError ?? 'Supabase is not configured');
      setData(null);
      setView('CREATE');
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('love_letters')
        .select('sender, recipient, message')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Not found');

      setData({ sender: data.sender, recipient: data.recipient, message: data.message });
      setView('RECEIVE');
    } catch (err) {
      console.error('Erreur de récupération Supabase:', err);
      setLoadError("Lien invalide ou expiré.");
      setData(null);
      setView('CREATE');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash !== '#') {
        if (hash.startsWith('#id=')) {
          const id = decodeURIComponent(hash.slice('#id='.length));
          if (id) {
            void fetchLetterById(id);
            return;
          }
        }

        const decoded = decodeLetter(hash);
        if (decoded) {
          setLoadError(null);
          setData(decoded);
          setView('RECEIVE');
        } else {
          setData(null);
          setView('CREATE');
        }
      } else {
        setLoadError(null);
        setData(null);
        setView('CREATE');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#fff5f6] selection:bg-[#FF4D6D] selection:text-white">
      <FloatingHearts />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-4xl mx-auto">
        {view === 'CREATE' ? (
          <>
            {loadError && (
              <p className="mb-4 text-sm text-red-600 font-semibold">
                {loadError}
              </p>
            )}
            <CreateView />
          </>
        ) : (
          isLoading ? (
            <p className="text-[#E63946] font-semibold">Chargement...</p>
          ) : (
            data && <ReceiveView data={data} />
          )
        )}
      </main>

      <footer className="relative z-10 p-6 text-center text-[#E63946] font-semibold opacity-60">
        Fait avec ❤️ pour la Saint-Valentin
      </footer>
    </div>
  );
};

export default App;

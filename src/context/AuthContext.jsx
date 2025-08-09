import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient'; // Garanta que o caminho está correto


// 1. Cria o Contexto (sem alterações)
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto com a lógica corrigida
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true); // Começa carregando, como antes

    useEffect(() => {
        // --- LÓGICA CORRIGIDA ---

        // 1. PRIMEIRO, VERIFICAMOS A SESSÃO INICIAL EXISTENTE.
        // Isso roda apenas uma vez para descobrir se o usuário já está logado
        // ao recarregar a página.
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (session?.user) {
                    setUser(session.user);
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    
                    if (profileError) {
                        console.error("Erro ao buscar perfil inicial:", profileError);
                    }
                    setProfile(profileData ?? null);
                }
            } catch (e) {
                console.error("Erro na verificação da sessão inicial:", e);
            } finally {
                // IMPORTANTE: O bloco 'finally' GARANTE que o loading termine,
                // não importa se houve sucesso ou erro na busca da sessão.
                setLoading(false);
            }
        };

        getInitialSession();

        // 2. DEPOIS, OUVIMOS MUDANÇAS FUTURAS (LOGIN E LOGOUT).
        // Este listener agora só precisa se preocupar com eventos que acontecem
        // DEPOIS do carregamento inicial.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);

            // Quando o usuário faz login/logout, não precisamos mais mexer no 'loading' inicial.
            // Apenas atualizamos o perfil.
            if (session?.user) {
                supabase.from('profiles').select('*').eq('id', session.user.id).single()
                    .then(({ data }) => setProfile(data ?? null));
            } else {
                setProfile(null);
            }
        });

        // Limpa a inscrição ao desmontar o componente
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // O valor a ser fornecido para os componentes filhos
    const value = {
        user,
        profile,
        loading,
    };

    // A lógica de renderização condicional permanece
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Hook customizado (sem alterações)
export function useAuth() {
    return useContext(AuthContext);
}
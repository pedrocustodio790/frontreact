import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import ComponentesTable from '../components/componentestable';
import ModalComponente from '../components/modalcomponente';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { isAdmin } from '../services/authService'; // 1. IMPORTA a nossa função de verificação

function ComponentesPage() {
    const [componentes, setComponentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false); // 2. CRIA o estado para guardar a permissão

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/componentes');
            setComponentes(response.data);
        } catch (error) {
            console.error("Erro ao buscar componentes:", error);
            toast.error("Não foi possível carregar os componentes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 3. VERIFICA o cargo do utilizador quando a página carrega
        setIsUserAdmin(isAdmin());
        fetchData();
    }, []);
    
    const handleEdit = (componente) => {
        setComponenteEmEdicao(componente);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Você tem certeza que deseja excluir este componente?")) {
            try {
                await api.delete(`/api/componentes/${id}`);
                toast.success('Componente excluído com sucesso!');
                fetchData(); 
            } catch (error) {
                toast.error('Falha ao excluir o componente.');
            }
        }
    };

    const handleAdd = () => {
        setComponenteEmEdicao(null);
        setModalVisible(true);
    };

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <div className="header-dashboard">
                    <h1>Gerenciamento de Componentes</h1>
                    {/* 4. O botão SÓ APARECE se isUserAdmin for true */}
                    {isUserAdmin && (
                        <button className="action-button" onClick={handleAdd}>
                            Adicionar Componente
                        </button>
                    )}
                </div>
                
                {loading ? (
                    <div className="loading-spinner-container">
                        <ClipLoader color={"var(--vermelhoSenai)"} loading={loading} size={50} />
                    </div>
                ) : (
                    <ComponentesTable 
                        componentes={componentes} 
                        onEdit={handleEdit}
                        onDelete={handleDelete} 
                        isAdmin={isUserAdmin} // 5. PASSA a informação para a tabela
                    />
                )}
            </main>

            <ModalComponente 
                isVisible={isModalVisible} 
                onClose={() => setModalVisible(false)}
                onComponenteAdicionado={fetchData}
                componenteParaEditar={componenteEmEdicao}
            />
        </div>
    );
}

export default ComponentesPage;

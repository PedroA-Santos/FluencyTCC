import React, { useState } from 'react';
import useListIdiomas from '../../hooks/useListIdiomas';
import useSalvarIdiomas from '../../hooks/useSalvarIdiomas';
import styles from './idiomasAprender.module.css';  // Supondo que você esteja usando CSS Module

function IdiomasAprender() {
    const { idiomas, loading: loadingIdiomas, error: erroIdiomas } = useListIdiomas();
    const { salvarIdiomas, loading, error, successMessage } = useSalvarIdiomas();
    const [selecionados, setSelecionados] = useState([]);
    const [niveles, setNiveles] = useState({});  // Para armazenar o nível de cada idioma

    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?.id;

    const handleCheckboxChange = (idiomaId) => {
        setSelecionados((prev) =>
            prev.includes(idiomaId)
                ? prev.filter((id) => id !== idiomaId)
                : [...prev, idiomaId]
        );
    };

    const handleNivelChange = (idiomaId, nivel) => {
        setNiveles((prev) => ({
            ...prev,
            [idiomaId]: nivel
        }));
    };

    const handleSalvar = async () => {
        if (selecionados.length === 0 || !userId) {
            alert("Selecione pelo menos um idioma.");
            return;
        }

        // Preparando os dados para salvar
        const idiomasComNivel = selecionados.map((idiomaId) => ({
            idiomaId,
            nivel: niveles[idiomaId] || 'Básico'  // Se não houver nível selecionado, assume 'Básico'
        }));

        await salvarIdiomas(userId, idiomasComNivel);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quais idiomas você quer aprender?</h2>

            {loadingIdiomas && <p className={styles.loadingText}>Carregando idiomas...</p>}
            {erroIdiomas && <p className={styles.errorText}>Erro: {erroIdiomas}</p>}

            {!loadingIdiomas && idiomas.length > 0 && (
                <form>
                    <div className={styles.checkboxContainer}>
                        <p>Selecione os idiomas e seus respectivos níveis:</p>
                        {idiomas.map((idioma) => (
                            <div key={idioma.id} className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    id={`idioma-${idioma.id}`}
                                    value={idioma.id}
                                    checked={selecionados.includes(idioma.id)}
                                    onChange={() => handleCheckboxChange(idioma.id)}
                                    className={styles.checkbox}
                                    disabled={loadingIdiomas}
                                />
                                <label htmlFor={`idioma-${idioma.id}`} className={styles.checkboxLabel}>
                                    {idioma.idioma}
                                </label>
                                {selecionados.includes(idioma.id) && (
                                    <select
                                        value={niveles[idioma.id] || 'Básico'}
                                        onChange={(e) => handleNivelChange(idioma.id, e.target.value)}
                                    >
                                        <option value="Básico">Básico</option>
                                        <option value="Intermediário">Intermediário</option>
                                        <option value="Avançado">Avançado</option>
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleSalvar}
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? "Salvando..." : "Salvar idiomas"}
                    </button>

                    {error && <p className={styles.errorText}>{error}</p>}
                    {successMessage && <p className={styles.successText}>{successMessage}</p>}
                </form>
            )}
        </div>
    );
}

export default IdiomasAprender;

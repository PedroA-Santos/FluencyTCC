import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contatos.module.css";
import useListContatos from "../hooks/useListContatos";
import useDesfazerMatch from "../hooks/useDesfazerMatch";
import usePerfilUsuario from "../hooks/usePerfilUsuario";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";
import { useMenu } from "../context/menuContext"; // Usando o contexto

function Contatos() {
  const { menuAberto, setMenuAberto, menuToggleRef } = useMenu();
  const userIdDaSessao = verificarSessaoUsuario();
  const { contatos, error, loading } = useListContatos();
  const { perfil, error: perfilError, loading: perfilLoading } = usePerfilUsuario(userIdDaSessao);
  const { desfazerMatch, loading: desfazerLoading, error: desfazerError } = useDesfazerMatch();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [localContatos, setLocalContatos] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, matchId: null });

  useEffect(() => {
    setLocalContatos(contatos);
  }, [contatos]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideMenu = menuRef.current?.contains(e.target);
      const clickedToggle = menuToggleRef?.current?.contains(e.target);
      const clickedContext = contextMenuRef.current?.contains(e.target);

      if (!clickedInsideMenu && !clickedToggle && !clickedContext) {
        setMenuAberto(false);
        setContextMenu({ visible: false, x: 0, y: 0, matchId: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuAberto, menuToggleRef]);

  const closeMenu = () => {
    setMenuAberto(false);
  };

  const handleDesfazerMatch = async (matchId) => {
    if (!window.confirm("Tem certeza que deseja desfazer o match?")) return;
    try {
      await desfazerMatch(matchId, userIdDaSessao);
      setLocalContatos((prev) => prev.filter((c) => c.matchId !== matchId));
      setContextMenu({ visible: false, x: 0, y: 0, matchId: null });
    } catch (err) {
      console.error("Erro ao desfazer match:", err);
    }
  };

    if (error || perfilError || desfazerError) {
        console.log("components/Contatos: Erro: ", error, "perfilError: ", perfilError, "desfazerError: ", desfazerError);
        
        
        return <div style={{ color: "red" }}>Erro: {error || perfilError || desfazerError}</div>;   
    }
    
    const imageUrl = perfil.foto_perfil
        ? `http://localhost:5000${perfil.foto_perfil}`
        : "/images/default-image.jpg";
  const handleContextMenu = (e, matchId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, matchId });
  };

  const perfilUrl = perfil.foto_perfil
    ? `http://localhost:5000${perfil.foto_perfil}`
    : "/images/default-image.jpg";

  if (loading || perfilLoading) return <div>Carregando contatos...</div>;
  if (error || perfilError || desfazerError) return <div style={{ color: "red" }}>Erro: {error || perfilError || desfazerError}</div>;

  return (
    <>
      <nav
        className={`${styles.containerLateral} ${menuAberto ? styles.menuAberto : ""}`}
        ref={menuRef}
        aria-hidden={!menuAberto}
      >
        <div className={styles.profileContainer}>
          <img
            src={perfilUrl}
            alt={perfil.username}
            className={styles.profileImage}
            onClick={() => {
              navigate(`/perfil/${userIdDaSessao}`);
              closeMenu();
            }}
          />
          <h2>{perfil.username}</h2>
          <div className={styles.buttonGroup}>
            <button className={styles.homeButton} onClick={() => { navigate("/"); closeMenu(); }}>
              Home
            </button>
            <button className={styles.logoutButton} onClick={() => {
              sessionStorage.removeItem("token");
              navigate("/login");
            }}>
              Logout
            </button>
          </div>
        </div>

        <div className={styles.matchesContainer}>
          <h2>Matches</h2>
          <ul>
            {localContatos.map((match) => {
              const matchImageUrl = match.foto_perfil
                ? `http://localhost:5000${match.foto_perfil}`
                : "/images/default-image.jpg";

              return (
                <li
                  key={match.matchId}
                  className={styles.matchItem}
                  onContextMenu={(e) => handleContextMenu(e, match.matchId)}
                  onClick={() => {
                    navigate(`/chat/${match.matchId}`);
                    closeMenu();
                  }}
                >
                  <img
                    src={matchImageUrl}
                    alt={match.username}
                    className={styles.profileImage}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/perfil/${match.id}`);
                      closeMenu();
                    }}
                  />
                  <span className={styles.usernameMatch}>
                    {match.username}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          role="menu"
        >
          <button
            onClick={() => handleDesfazerMatch(contextMenu.matchId)}
            disabled={desfazerLoading}
            className={styles.contextMenuItem}
          >
            Desfazer Match
          </button>
        </div>
      )}
    </>
  );
}

export default Contatos;

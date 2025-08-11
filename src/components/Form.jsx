import PropTypes from "prop-types";
import GetAvatar from "./GetAvatar";
import { useState } from "react";

function Form({ pprojectData, psetProjectData }) {
  const [message, setMessage] = useState("");
  const [cardURL, setCardURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (ev) => {
    const id = ev.target.id;
    const value = ev.target.value;
    const newProjectData = {
      ...pprojectData,
      [id]: value,
    };
    localStorage.setItem("projectData", JSON.stringify(newProjectData));
    psetProjectData(newProjectData);
  };

  const handleClick = (ev) => {
    ev.preventDefault();
    setMessage("Creando proyecto...");
    console.log("Enviando datos del proyecto:", pprojectData);

    fetch("https://gestor-de-proyectos-5l4s.onrender.com/project/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: pprojectData.name,
        slogan: pprojectData.slogan,
        repo: pprojectData.repo,
        demo: pprojectData.demo,
        technologies: pprojectData.technologies,
        desc: pprojectData.description,
        author: pprojectData.author,
        job: pprojectData.job,
        photo: pprojectData.photo,
        image: pprojectData.image,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta completa:", data);
        if (data.success) {
          setMessage("Tu proyecto ha sido creado con éxito");

          // Obtenemos el id que devuelve el backend
          const id = data.project_id;

          if (!id) {
            setErrorMessage(
              "No se recibió el id del proyecto en la respuesta."
            );
            setCardURL("");
            return;
          }

          // Construimos la URL del detalle
          const url = `https://gestor-de-proyectos-5l4s.onrender.com/project/detail/${id}`;
          setCardURL(url);
          setErrorMessage("");
        } else {
          setErrorMessage("Por favor, completa todos los campos.");
          setMessage("");
          setCardURL("");
        }
      })
      .catch((error) => console.error("Error en el fetch:", error));
  };

  return (
    <>
      <form className="addForm">
        <h2 className="title">Información</h2>
        <fieldset className="addForm__group">
          <legend className="addForm__title">
            Cuéntanos sobre el proyecto
          </legend>
          <input
            onChange={handleChange}
            className="addForm__input"
            type="text"
            name="name"
            id="name"
            placeholder="Nombre del proyecto"
            value={pprojectData.name}
            required
          />
          <input
            onChange={handleChange}
            className="addForm__input"
            type="text"
            name="slogan"
            id="slogan"
            placeholder="Slogan"
            value={pprojectData.slogan}
            required
          />
          <div className="addForm__2col">
            <input
              onChange={handleChange}
              className="addForm__input"
              type="url"
              name="repo"
              id="repo"
              placeholder="Repositorio"
              value={pprojectData.repo}
              required
            />
            <input
              onChange={handleChange}
              className="addForm__input"
              type="url"
              name="demo"
              id="demo"
              placeholder="Demo"
              value={pprojectData.demo}
              required
            />
          </div>
          <input
            onChange={handleChange}
            className="addForm__input"
            type="text"
            name="technologies"
            id="technologies"
            placeholder="Tecnologías"
            value={pprojectData.technologies}
            required
          />
          <textarea
            onChange={handleChange}
            className="addForm__input"
            name="description"
            id="description"
            placeholder="Descripción"
            value={pprojectData.description}
            rows="5"
            required
          ></textarea>
        </fieldset>

        <fieldset className="addForm__group">
          <legend className="addForm__title">Cuéntanos sobre la autora</legend>
          <input
            onChange={handleChange}
            className="addForm__input"
            type="text"
            name="author"
            id="author"
            placeholder="Nombre"
            value={pprojectData.author}
            required
          />
          <input
            onChange={handleChange}
            className="addForm__input"
            type="text"
            name="job"
            id="job"
            placeholder="Trabajo"
            value={pprojectData.job}
            required
          />
        </fieldset>

        <div className="form-buttons-container">
          <fieldset className="addForm__group--uploadphoto">
            <GetAvatar
              avatar={pprojectData.image}
              updateAvatar={(image) => {
                const updated = { ...pprojectData, image };
                psetProjectData(updated);
                localStorage.setItem("projectData", JSON.stringify(updated));
              }}
              text="Subir foto del proyecto"
            />
          </fieldset>

          <fieldset className="addForm__group--uploadauthor">
            <GetAvatar
              avatar={pprojectData.photo}
              updateAvatar={(photo) => {
                const updated = { ...pprojectData, photo };
                psetProjectData(updated);
                localStorage.setItem("projectData", JSON.stringify(updated));
              }}
              text="Subir foto de la autora"
            />
          </fieldset>
        </div>

        <button className="form-project-btn" onClick={handleClick}>
          Crear proyecto
        </button>

        {message && <p className="form-message">{message}</p>}

        {cardURL && (
          <p className="form-url">
            <a
              className="form-url"
              href={cardURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver proyecto creado
            </a>
          </p>
        )}

        {errorMessage && <p className="form-error">{errorMessage}</p>}
      </form>
    </>
  );
}

Form.propTypes = {
  pprojectData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slogan: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    demo: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
  }).isRequired,
  psetProjectData: PropTypes.func.isRequired,
};

export default Form;

import "../styles/components/project-list.scss";
import { useEffect, useState } from "react";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/project/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.results);
        }
      })
      .catch((error) => console.error("Error al cargar proyectos:", error));
  }, []);

  return (
    <section className="project-list">
      <h2 className="project-list__title">Todos los proyectos</h2>
      <a className="back_button" href="/">
        {" "}
        Volver al inicio
      </a>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.slogan}</p>
            <p>Autor/a: {project.author}</p>
            <img src={project.image} alt="Imagen del proyecto" width={150} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectList;

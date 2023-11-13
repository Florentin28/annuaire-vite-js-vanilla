import * as bootstrap from "bootstrap";
import "./style.css";
import { data } from "./data";
import { nav } from "./nav";
import Fuse from "fuse.js";

function compareNoms(a, b) {
  const nomA = (a.prenom + " " + a.nom).toUpperCase();
  const nomB = (b.prenom + " " + b.nom).toUpperCase();

  if (nomA > nomB) {
    return -1;
  }
  if (nomA < nomB) {
    return 1;
  }
  return 0;
}

const fuseOptions = {
  keys: ["prenom", "nom"],
  includeScore: true,
  threshold: 0.3,
};

const fuse = new Fuse(data, fuseOptions);

function afficherPersonnes(personnes) {
  const personnesHtml = personnes
    .map(
      (personne) => `
        <a class="card col-5 col-md-3" href="/personne/?id=${personne.id}">
          <img src="${personne.avatar}" class="card-img-top w-30 h-30 object-cover" alt="avatar de ${personne.prenom} ${personne.nom}">
          <div class="card-body">
            <h5 class="card-title">${personne.prenom} ${personne.nom}</h5>
          </div>
        </a>
      `
    )
    .join("");
  document.querySelector("#personnes").innerHTML = personnesHtml;
}

document.querySelector("#app").innerHTML = `
  <main>
    ${nav}

    <div class="container my-4">
      <div class="mb-3">
        <input type="text" id="recherche" class="form-input w-full md:w-1/2 lg:w-1/3" placeholder="Rechercher par nom ou prénom">
      </div>
      <div id="personnes" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      </div>
    </div>
  </main>
`;

const inputRecherche = document.querySelector("#recherche");

inputRecherche.addEventListener("input", (event) => {
  const recherche = event.target.value;
  if (recherche) {
    const resultats = fuse.search(recherche);
    const personnesFiltrees = resultats.map((resultat) => resultat.item);
    afficherPersonnes(personnesFiltrees);
  } else {
    afficherPersonnes(data);
  }
});

afficherPersonnes(data);

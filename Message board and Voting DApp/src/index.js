import { ethers } from "ethers";
/**
 * Obtenemos el abi importándolo del fichero abi.json
 */
import abi_raw from "./abi.json";
// Variables constantes
const domain = window.location.host;
const origin = window.location.origin;
/**
 * De esta forma obtenemos el acceso a metamask
 */
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
/**
 * La dirección del contrato desplegado
 */
// Address del contrato desplegado en clase
let contract_address = "0x01d5Fd6f2a46BF6f441109786120B5C3EC89ddA6";
let contract = new ethers.Contract(contract_address, abi_raw.abi, signer);

/**
 *  Conectar Wallet de Metamask
 */
// Botón
const connectWalletBtn = document.getElementById("connectWalletBtn");
connectWalletBtn.onclick = connectWallet;
// Función
function connectWallet() {
  provider
    .send("eth_requestAccounts", [])
    .catch(() => console.log("User rejected request"));
}

/**
 * Registrarse
 */
// Botón
const registerUserBtn = document.getElementById("registerUserBtn");
registerUserBtn.onclick = registerUser;
// Función
async function registerUser() {
  try {
    await contract.registerOpenUser();
  } catch (error) {
    console.log(error.message);
  }
}
/**
 * Comprobar registro de usuario
 */
// Botón
const isRegisteredBtn = document.getElementById("isRegisteredBtn");
isRegisteredBtn.onclick = isRegistered;
// Función
async function isRegistered() {
  try {
    let usuario = document.getElementById("is_registered_user").value;
    const registered = await contract.IsRegisteredUser(usuario);
    registered
      ? (document.getElementById("register_status").value = "Registrado")
      : (document.getElementById("register_status").value = "No registrado");
  } catch (error) {
    console.log(error.message);
  }
}
/**
 * Obtener último comentario
 */
// Botón
const getCommentBtn = document.getElementById("getCommentBtn");
getCommentBtn.onclick = getComment;
// Función
async function getComment() {
  try {
    const comment = await contract.getLastComent();
    const textInput = document.getElementById("getComment");
    textInput.style.width = comment.length + "ch";
    textInput.value = comment;
  } catch (error) {
    console.log(error.message);
    document.getElementById("getComment").value = "Error obteniendo comentario";
  }
}
/**
 * Fijar ultimo comentario
 */
// Botón
const setCommentBtn = document.getElementById("setCommentBtn");
setCommentBtn.onclick = setComment;
// Función
async function setComment() {
  const comment = document.getElementById("setComment").value;
  try {
    await contract.setLastComent(comment);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * FASE 2: AMPLIACIÓN A REGISTRAR PROPUESTAS
 */

/**
 * Registrar propuesta
 */
// Botón
const registerProposalBtn = document.getElementById("registerProposalBtn");
registerProposalBtn.onclick = registerProposal;
// Función
async function registerProposal() {
  const proposal = document.getElementById("register_proposal").value;
  try {
    await contract.addProposal(proposal);
  } catch (error) {
    console.log(error.message);
  }
}
/**
 * Votar propuesta
 */
// Botón
const voteProposalBtn = document.getElementById("voteProposalBtn");
voteProposalBtn.onclick = voteProposal;
// Función
async function voteProposal() {
  const aFavor = document.getElementById("vote_proposal_checkbox").checked;
  const proposal = document.getElementById("vote_proposal").value;
  try {
    await contract.voteProposal(proposal, aFavor);
  } catch (error) {
    console.log(error.message);
  }
}
/**
 * Conteo de votos de la propuesta
 */
// Botón
const getVotesProposalBtn = document.getElementById("getVotesProposalBtn");
getVotesProposalBtn.onclick = getVotesProposal;
// Función
async function getVotesProposal() {
  const proposal = document.getElementById("get_proposal_votes").value;
  try {
    const proposal_votes = document.getElementById("proposal_votes");
    const votes = (await contract.getProposal(proposal))[1];
    votes
      ? (proposal_votes.value = votes.toString())
      : (proposal_votes.value = 0);
  } catch (error) {
    proposal_votes.value = "";
    console.log(error.message);
  }
}

/**
 * MEJORA: SELECTOR DE PROPUESTAS
 */
// Función auxiliar para limpiar el selector
function cleanSelector() {
  // Recuperar selector
  const selector = document.getElementById("selectProposal");
  // Eliminamos el primer elemento del selector tantas veces como elementos tenga
  for (let i = 0; i <= selector.length; i++) {
    selector.remove(0);
  }
}

/**
 * Actualizar lista de propuestas
 */
// Botón
const updateProposalsBtn = document.getElementById("updateProposalsBtn");
updateProposalsBtn.onclick = updateProposalList;
// Función
async function updateProposalList() {
  const selector = document.getElementById("selectProposal");
  try {
    // Obtener propuestas
    const listProposals = await contract.getProposals();
    // Limpiar el selector
    cleanSelector(selector);
    // Recorrer el listado de propuestas y añadirlas al selector
    for (let i = 0; i < listProposals.length; i++) {
      let prop = listProposals[i];
      let option = document.createElement("option");
      option.textContent = prop;
      option.value = prop;
      selector.appendChild(option);
    }
  } catch (error) {
    console.log(error.message);
  }
}
/**
 * Votar propuesta 2
 */
// Botón
const voteProposalFromListBtn = document.getElementById(
  "voteProposalFromListBtn"
);
voteProposalFromListBtn.onclick = voteProposalFromList;
// Función
async function voteProposalFromList() {
  const selector = document.getElementById("selectProposal");
  const proposal = selector.options[selector.selectedIndex].value;
  const aFavor = document.getElementById("vote_proposal_checkbox2").checked;
  try {
    await contract.voteProposal(proposal, aFavor);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Solicitar los resultados
 */
const resultsBtn = document.querySelector("XXX");
resultsBtn.addEventListener("click", checkResult());

async function checkResult() {
  const div = createElement("div");
  winner = await contract.checkVotes();
  div.innerHTML = `
  <br /><br />
  <p> "The ID winner is:" ${winner}</p> `;

  resultsBtn.voteProposalFromListBtn.appendChild(div);
}

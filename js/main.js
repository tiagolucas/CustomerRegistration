'use strict'

/* Abre o modal */
const openModal = () => document.getElementById('modal').classList.add('active');

/* Fecha o modal e limpa os campos */
const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

/* Função GET do localStorage */
const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClients')) ?? [];

/* Função SET do localStorage */
const setLocalStorage = (dbClients) => localStorage.setItem('dbClients', JSON.stringify(dbClients));

/* CRUD - Create, Read, Update, Delete */

/* DELETE */
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};

/* Update */
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
};

/* READ */
const readClient = () => getLocalStorage();

/* CREATE */
const createClient = (client) => {
    const dbClients = getLocalStorage();
    dbClients.push(client);
    setLocalStorage(dbClients);
};

/* Interação com o layout */
/* Cria a linha que vai ser inserida na tabela através de tbody e appendChild */
const createRow = (client, index) => { /* o index para ser usado no EDITAR ou EXCLUIR */
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.cellPhone}</td>
        <td>${client.city}</td>
        <td>
            <button type="button" class="button green" data-action="edit-${index}">Editar</button>
            <button type="button" class="button red" data-action="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

/* Limpa todas as linhas da tabela antes de fazer o próximo UPDATETABLE */
const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

/* Atualiza a tabela criando uma nova linha e limpa a tabela */
const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
};

updateTable();

/* pega todos os campos do modal e limpa os mesmos */
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
};

/* Funções verificação se os campos são validos */
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
};

/* Pega dados dos clientes, chama função verifica se os campos são validos, chama função cria o cliente, e chama função fecha modal */
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            name: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cellPhone: document.getElementById('celular').value,
            city: document.getElementById('cidade').value
        };

        /* vai verificar se o cliente é novo se SIM faz todas as chamadas de funções necessárias */
        const index = document.getElementById('nome').dataset.index;

        if (index === 'new') {
            createClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        };
    };
};

/* Função que vai preencher e chamar o modal com as informa;'oes do cliente */
const fillFields = (client) => {
    document.getElementById('nome').value = client.name;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.cellPhone;
    document.getElementById('cidade').value = client.city;

    /* Acrescenta o index do cliente quando for editar o mesmo */
    document.getElementById('nome').dataset.index = client.index;
};

/* Função que vai editar o cliente e preenche o modal através de outra função com as informações do cliente para editar */
const editClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    openModal();
};

/* Função que vai editar ou deletar chamando suas funções, vai identificar o cliente através do target, dataset e action do botão clicado */
/* poderia ser ID no lugar de DATASET */
const editDelete = (event) => {
    if (event.target.type === 'button') {

        const [action, index] = event.target.dataset.action.split('-');

        if (action === 'edit') {
            editClient(index);
        } else {
            const client = readClient()[index];
            const response = confirm(`Deseja realmente excluir o cliente ${client.name}`);

            if (response === true) {
                deleteClient(index);
                updateTable();
            };
        };
    };
};

/* Eventos */
/* Abrir o modal ao clicar Cadastra Cliente */
document.getElementById('cadastrarCliente').addEventListener('click', openModal);

/* Fechar o modal ao clicar em Fechar no modal */
document.getElementById('modalClose').addEventListener('click', closeModal);

/* Salvar cliente ao clicar em Salvar no modal*/
document.getElementById('salvar').addEventListener('click', saveClient);

/* Vai ver qual o botão foi clicado EDITAR ou DELETAR */
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);

/* 
https://tiagolucas.github.io/CustomerRegistration/
 */
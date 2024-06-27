const pokemonName = document.querySelector('.pokemon_name'); // Seleciona o elemento que exibirá o nome do Pokémon
const pokemonNumber = document.querySelector('.pokemon_number'); // Seleciona o elemento que exibirá o número do Pokémon
const pokemonImage = document.querySelector('.pokemon_image'); // Seleciona o elemento que exibirá a imagem do Pokémon
const pokemonFundo = document.querySelector('.pokemon_fundo'); // Seleciona o elemento que exibirá o fundo do Pokémon
const form = document.querySelector('.form'); // Seleciona o formulário de busca
const input = document.querySelector('.input_search'); // Seleciona o campo de entrada de busca
const buttonPrev = document.querySelector('.btn-prev'); // Seleciona o botão "prev"
const buttonNext = document.querySelector('.btn-next'); // Seleciona o botão "next"

let searchPokemon = 16; // Inicia com o ID 16
let allPokemon = []; // Armazena todos os Pokémon

// Função assíncrona para buscar todos os Pokémon da API
const fetchAllPokemon = async () => {
    const APIResponse = await fetch(`https://dev-api-teste.mandarin.com.br/pokemons`);
    if (APIResponse.status === 200) { // Verifica se a resposta foi bem-sucedida
        const data = await APIResponse.json(); // Converte a resposta em JSON
        return data;
    }
    throw new Error(`Failed to fetch Pokemon data: ${APIResponse.status}`); // Lança um erro se a resposta não foi bem-sucedida
}

// Função assíncrona para renderizar o Pokémon
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Carregando...'; // Exibe "Carregando..." enquanto busca o Pokémon
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none'; // Esconde a imagem enquanto busca

    if (allPokemon.length === 0) { // Verifica se a lista de todos os Pokémon está vazia
        try {
            allPokemon = await fetchAllPokemon(); // Busca todos os Pokémon
        } catch (error) {
            console.error('Error fetching all Pokemon:', error); // Exibe um erro no console
            pokemonName.innerHTML = 'Erro ao buscar Pokémon'; // Exibe uma mensagem de erro na interface
            pokemonNumber.innerHTML = '';
            return; // Sai da função se houver um erro
        }
    }

    // Verifica se pokemon é um número ou uma string e encontra o Pokémon correspondente
    const pokemonData = allPokemon.find(p => p.id == pokemon || p.name.toLowerCase() === pokemon.toString().toLowerCase());

    if (pokemonData) { // Se o Pokémon for encontrado
        pokemonImage.style.display = 'block'; // Exibe a imagem do Pokémon
        pokemonFundo.style.display = 'block'
        pokemonName.innerHTML = pokemonData.name; // Exibe o nome do Pokémon
        pokemonNumber.innerHTML = pokemonData.id; // Exibe o número do Pokémon
        pokemonImage.src = pokemonData.image_url; // Define a URL da imagem do Pokémon
        pokemonFundo.src = pokemonData.background_image_url; // Define a URL da imagem de fundo do Pokémon
        input.value = ''; // Limpa o campo de busca
        searchPokemon = pokemonData.id; // Atualiza a variável searchPokemon
    } else { // Se o Pokémon não for encontrado
        pokemonName.innerHTML = 'Não encontrado'; // Exibe "Não encontrado"
        pokemonNumber.innerHTML = '';
        pokemonFundo.src = 'none';
        pokemonFundo.style.display = 'none';
    }

    // Desabilita os botões conforme necessário
    buttonPrev.disabled = searchPokemon <= 16; // Desabilita o botão "prev" se o ID for 16 ou menor
    buttonNext.disabled = searchPokemon >= 30; // Desabilita o botão "next" se o ID for 30 ou maior
}

// Adiciona um listener de evento para o formulário de busca
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário
    renderPokemon(input.value); // Chama a função renderPokemon com o valor do campo de busca
});

// Adiciona um listener de evento para o botão "prev"
buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 16) { // Verifica se o ID atual é maior que 16
        renderPokemon(searchPokemon - 1); // Chama a função renderPokemon com o ID anterior
    }
});

// Adiciona um listener de evento para o botão "next"
buttonNext.addEventListener('click', () => {
    if (searchPokemon < 30) { // Verifica se o ID atual é menor que 30
        renderPokemon(searchPokemon + 1); // Chama a função renderPokemon com o próximo ID
    }
});

// Renderiza o Pokémon inicial (ID 16)
renderPokemon(searchPokemon);

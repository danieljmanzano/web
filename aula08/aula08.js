// atividade 1: criar uma página html com script js que percorra os dados do json retornado e
// liste na tela: "título do herói: nome do herói (ano de criação) \n imagem do herói"

async function getHerois() {
    try {
        const resp = await fetch('https://api.jsonbin.io/v3/b/69c30947aa77b81da9170645')
        if (!resp.ok) 
            throw new Error('Erro na requisição dos dados dos heróis')
        const data = await resp.json()
        const herois = data.record.heroisdc
        
        const container = document.getElementById('heroisdc')
        
        herois.forEach(heroi => {
            const div = document.createElement('div')
            div.innerHTML = `
                <h2>${heroi.heroi}: ${heroi.nome} (${heroi.criacao})</h2>
                <img src="${heroi.img}" alt="${heroi.nome}">
            `
            container.appendChild(div)
        })
    } catch (error) {
        console.error(error.message)
    }
}

getHerois()
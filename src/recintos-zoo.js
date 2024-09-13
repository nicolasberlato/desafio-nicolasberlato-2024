class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, especies: { 'MACACO': 3 } },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, especies: {} },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, especies: { 'GAZELA': 1 } },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, especies: {} },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, especies: { 'LEAO': 1 } }
        ];

        this.animais = [
            { especie: 'LEAO', tamanho: 3, biomas: ['savana'], carnivoro: true },
            { especie: 'LEOPARDO', tamanho: 2, biomas: ['savana'], carnivoro: true },
            { especie: 'CROCODILO', tamanho: 3, biomas: ['rio'], carnivoro: true },
            { especie: 'MACACO', tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            { especie: 'GAZELA', tamanho: 2, biomas: ['savana'], carnivoro: false },
            { especie: 'HIPOPOTAMO', tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        ];
    }

    calcularEspacoDisponivel(recinto, animal, quantidade) {
        let espacoOcupado = 0;
        for (let especie in recinto.especies) {
            const animalExistente = this.animais.find(a => a.especie === especie);
            espacoOcupado += animalExistente.tamanho * recinto.especies[especie]
        }

        if (Object.keys(recinto.especies).length > 0 && !recinto.especies.hasOwnProperty(animal.especie)) {
            espacoOcupado += 1;
        }

        const espacoTotal = recinto.tamanhoTotal;
        const espacoNecessario = animal.tamanho * quantidade;

        return {
            suficiente: espacoTotal - espacoOcupado >= espacoNecessario,
            espacoLivre: espacoTotal - espacoOcupado - espacoNecessario,
            espacoTotal: espacoTotal
        };
    }

    encontrarRecintoAdequado(tipo, quantidade) {
        const animal = this.animais.find(a => a.especie === tipo);
        if (!animal) return { erro: "Animal inválido" };
        if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: "Quantidade inválida" };

        const recintosAdequados = this.recintos.filter(recinto => {
            const espaco = this.calcularEspacoDisponivel(recinto, animal, quantidade);

            if (!animal.biomas.some(bioma => recinto.bioma.includes(bioma)) || !espaco.suficiente) return false;

            if (animal.carnivoro && Object.keys(recinto.especies).length > 0 && !recinto.especies.hasOwnProperty(animal.especie)) return false;

            if (Object.keys(recinto.especies).some(especie => {
                const animalExistente = this.animais.find(a => a.especie === especie);
                return animalExistente.carnivoro && especie !== animal.especie;
            })) return false;

            if (animal.especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && Object.keys(recinto.especies).length > 0) return false;

            if (animal.especie === 'MACACO' && quantidade === 1 && Object.keys(recinto.especies).length === 0) return false;

            return true;
        });

        if (recintosAdequados.length === 0) return { erro: "Não há recinto viável" };

        const recintosViaveis = recintosAdequados.map(recinto => {
            const espaco = this.calcularEspacoDisponivel(recinto, animal, quantidade);
            return `Recinto ${recinto.numero} (espaço livre: ${espaco.espacoLivre} total: ${espaco.espacoTotal})`;
        }).sort((a, b) => a.numero - b.numero);

        return { recintosViaveis };
    }

    analisaRecintos(animal, quantidade) {
        return this.encontrarRecintoAdequado(animal, quantidade);
    }
}

export { RecintosZoo as RecintosZoo };
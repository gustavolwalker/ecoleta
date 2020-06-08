import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return await knex("items").del()
        .then(() => {
            // Inserts seed entries
            return knex("items").insert([
                { title: 'Pilhas e Baterias', image: 'baterias.svg' },
                { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
                { title: 'Lâmpadas', image: 'lampadas.svg' },
                { title: 'Óleo de Cozinha', image: 'oleo.svg' },
                { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
                { title: 'Papeis e Papelão', image: 'papeis-papelao.svg' },
            ]);
        });
};

import * as request from 'supertest';
import { CreateProfessorDto } from '@app/professor/dto/create-professor.dto';


describe('Professor Module e2e Test', () => {
    const baseURL = 'http://localhost:3000/professors';
    const professor = {
        name: 'Pedro Frosi Rosa',
        sex: 'Masculino',
        email: 'pfrosi@ufu.br',
        photoPath: 'caminho-do-bucket-para-foto',
        description: `Possui mestrado em Engenharia de Computação pela Escola Politécnica da Universidade de São Paulo (1990) 
        na área de Arquitetura de Redes de Computadores e doutorado em Engenharia de Computação por um acordo de cooperação 
        internacional entre Escola Politécnica da Universidade de São Paulo e o Centre National de la Recherche Scientifique 
        (CNRS-France 1995) na área de sistemas distribuídos no Laboratoire d'Analyse et d'Architecture des Systemes (LAAS)/Toulouse.`,
        facomPageUrl: 'https://facom.ufu.br/pessoas/docentes/pedro-frosi-rosa',
    } as CreateProfessorDto;


    it("POST: should create a professor", async () => {
        const response = await request(baseURL)
            .post("")
            .send(professor);
        expect(response.statusCode).toBe(201);
        expect(response.ok).toBeTruthy();
        expect(response.body.message).toBe("Created Successfully");
        expect(response.body.data).toEqual(professor);
    });

    it("GET: should list all professors",async () => {
        const response = await request(baseURL)
            .get("");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Found Successfully");
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data[0].name).toBe(professor.name);
        expect(response.body.data[0].sex).toBe(professor.sex);
        expect(response.body.data[0].email).toBe(professor.email);
        expect(response.body.data[0].photoPath).toBe(professor.photoPath);
        expect(response.body.data[0].description).toBe(professor.description);
        expect(response.body.data[0].facomPageUrl).toBe(professor.facomPageUrl);
    });

    it("PATCH: should update a professor by a given id", async () => {
        const newProfessor = {
            name: 'Pedro Frosi Rosa',
            sex: 'Masculino',
            email: 'pfrosi@ufu.br',
            photoPath: 'caminho-do-bucket-para-foto',
            description: `Frosi vai aprovar todos os alunos de PDS2.`,
            facomPageUrl: 'https://facom.ufu.br/pessoas/docentes/pedro-frosi-rosa',   
        } as CreateProfessorDto;

        const givenId = "1";
        const response = await request(baseURL)
            .patch(`/${givenId}`)
            .send(newProfessor);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Updated Successfully");
        expect(response.body.data.name).toBe(newProfessor.name);
        expect(response.body.data.sex).toBe(newProfessor.sex);
        expect(response.body.data.email).toBe(newProfessor.email);
        expect(response.body.data.photoPath).toBe(newProfessor.photoPath);
        expect(response.body.data.description).toBe(newProfessor.description);
        expect(response.body.data.facomPageUrl).toBe(newProfessor.facomPageUrl);
    });


    it("DELETE: should delete a professor by a given id", async () => {
        const givenId = "1";
        const response = await request(baseURL)
            .delete(`/${givenId}`)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Deleted Successfully");
        expect(response.body.data).toBeNull();
        
    });
});
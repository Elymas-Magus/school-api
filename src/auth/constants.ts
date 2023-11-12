export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};  

// Não exponha esta chave publicamente.
// Fizemos isso aqui para deixar claro o que o código está fazendo,
// mas em um sistema de produção você deve proteger essa chave usando medidas apropriadas,
// como cofre de segredos, variável de ambiente ou serviço de configuração. 
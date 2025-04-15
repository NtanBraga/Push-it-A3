# Guia de Contribuição
Siga aqui as guidelines para contribuição no projeto

## Contribuindo com código
Como você pode contribuir com código para o projeto

### 1) Clone localmente
Abra o seu cmd na pasta local do projeto e digite o comando git clone seguido da URL do seu fork para clonar o seu repositório localmente. Por exemplo:

```bash
git clone https://github.com/SEU_USERNAME/jornada-cientifica.git
```
Rode o comando `npm init` para instalar todas as dependências do nodeJS dentro de cada pasta (api e client)
### 2) Crie uma nova `branch`
Utilize o comando git checkout -b para criar e alternar para a nova branch e nomeie-a conforme a issue sendo resolvida
> Exemplo: `git checkout -b feat/controllers-user`

### 3.1) Crie um Commit
Crie um commit e adicione a mensagem indicando a issue resolvida:
> Exemplo: `git commit -m"feat: create controllers-user"`

### 3.2) Crie um Commit para Bug-Create
Crie um commit e adicione a mensagem indicando o bug para correção:
> Exemplo: `git commit -m"bug-create: (código do erro): descrição do erro"`

### 3.3) Crie um Commit para Bug-Fix
Crie um commit e adicione a mensagem indicando o bug corrigido:
> Exemplo: `git commit -m"bug-fix: (código do erro): descrição do erro"`

### 3.4) Crie um Commit para Test 
Crie um commit e adicione a mensagem indicando o test criado:
> Exemplo: `git commit -m"test: descrição referente à que feature foi criado o teste`

## Contribuindo criando issues
### 1) Abra a aba `issues` e crie um novo issue
### 2) Selecione um template para a sua necessidade
### 3.1) Selecione `feat:` para adicionar uma issue de feature
### 3.2) Selecione `bug-fix:` para adicionar uma issue de bug (bug que necessita correção)
### 3.3) Selecione `test:` para adicionar uma issue de teste (necessário criar teste para alguma feature)
### 3.4) Para caso de uma issue customizada, use o mesmo modelo de escrita: `propósito-da-issue: descrição-da-issue`

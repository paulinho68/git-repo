import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {Link} from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';

import logo from '../../assets/logo.svg';

import api from '../../services/api';


interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const sotragedRepositoreis = localStorage.getItem('@GithubExplorer:repositories');

        if(sotragedRepositoreis){
            return JSON.parse(sotragedRepositoreis);
        }
        return [];
    });


    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    },[repositories])

    const handleAddRepository = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if(!newRepo){
            setInputError('Digite o autor/nome do repositório');
            return;
        }

        try{

            const response = await api.get(`/repos/${newRepo}`);

            setRepositories([...repositories, response.data]);

            setNewRepo('');
            setInputError('');
        }catch (err){
            setInputError('Erro na busca por esse repositório');
        }

    }

    return (
        <>
            <img src={logo} alt="Github Explorer" />
            <Title>Explore respositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.currentTarget.value)}
                    type="text"
                    placeholder="Digite o nome do repositório"
                    id="input-repository"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link to={`/repository/${repository.full_name}`} key={repository.full_name}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard;

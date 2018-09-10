import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';

import logo from '../../assets/logo.png';

import { Container, Form } from './styles';

import CompareList from '../../components/CompareList';

export default class Main extends Component {
  state = {
    repositoryError: false,
    reposritoryInput: '',
    repositories: [],
  };

  hadleAddRepository = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const { data: repository } = await api.get(`/repos/${this.state.reposritoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        loading: false,
        reposritoryInput: '',
        repositories: [...this.state.repositories, repository],
        repositoryError: false,
      });
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={this.state.repositoryError} onSubmit={this.hadleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.reposritoryInput}
            onChange={e => this.setState({ reposritoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>
        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}

import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => ({
  ...product,
  category: categoriesFromServer.find(
    category => category.id === product.categoryId,
  ) || null,
}));

const productsWithUsers = products.map(product => ({
  ...product,
  user: usersFromServer.find(user => product.category
    && user.id === product.category.ownerId) || null,
}));

function getPreparedProducts(prods, selectedUserId, query) {
  let preparedProducts = [...prods];

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();

    preparedProducts = preparedProducts.filter(
      prod => prod.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (selectedUserId) {
    preparedProducts = preparedProducts.filter(
      prod => prod.user.id === selectedUserId,
    );
  }

  return preparedProducts;
}

export const Table = ({ prepPdoducts }) => (
  <div className="box table-container">
    {!prepPdoducts.length ? (
      <p data-cy="NoMatchingMessage">
        No products matching selected criteria
      </p>
    ) : (
      <table
        data-cy="ProductTable"
        className="table is-striped is-narrow is-fullwidth"
      >
        <thead>
          <tr>
            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                ID

                <a href="#/">
                  <span className="icon">
                    <i data-cy="SortIcon" className="fas fa-sort" />
                  </span>
                </a>
              </span>
            </th>

            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                Product

                <a href="#/">
                  <span className="icon">
                    <i data-cy="SortIcon" className="fas fa-sort-down" />
                  </span>
                </a>
              </span>
            </th>

            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                Category

                <a href="#/">
                  <span className="icon">
                    <i data-cy="SortIcon" className="fas fa-sort-up" />
                  </span>
                </a>
              </span>
            </th>

            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                User

                <a href="#/">
                  <span className="icon">
                    <i data-cy="SortIcon" className="fas fa-sort" />
                  </span>
                </a>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {prepPdoducts.map(product => (
            <tr data-cy="Product" key={product.id}>
              <td className="has-text-weight-bold" data-cy="ProductId">
                {product.id}
              </td>

              <td data-cy="ProductName">{product.name}</td>
              <td data-cy="ProductCategory">
                {`${product.category.icon} - ${product.category.title}`}
              </td>

              <td
                data-cy="ProductUser"
                className={classNames({
                  'has-text-link': product.user.sex === 'm',
                  'has-text-danger': product.user.sex === 'f',
                })}
              >
                {product.user.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [query, setQuery] = useState('');

  function reset() {
    setSelectedUser('');
    setQuery('');
  }

  const preparedProducts = getPreparedProducts(
    productsWithUsers,
    selectedUser,
    query,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={classNames({
                  'is-active': selectedUser === '',
                })}
                onClick={() => setSelectedUser('')}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <Table prepPdoducts={preparedProducts} />
      </div>
    </div>
  );
};

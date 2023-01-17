import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import { User } from './types/User';
import { Category } from './types/Category';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

function getUserFromId(ownerId: number | undefined): User | null {
  const foundUser = usersFromServer.find((user) => user.id === ownerId);

  return foundUser || null;
}

function getCategoryFromId(categoryId: number | null): Category | null {
  const foundCategory = categoriesFromServer
    .find((category) => category.id === categoryId);

  return foundCategory || null;
}

export const itemList = productsFromServer
  .map((item) => {
    const cat = getCategoryFromId(item.categoryId);

    return ({
      product: item,
      category: cat,
      user: getUserFromId(cat?.ownerId),
    });
  });

export const App: React.FC = () => {
  const allUsersButton = 'All';
  const [visibleItems, setVisibleItems] = useState(itemList);
  const [activeUser, setActiveUser] = useState(allUsersButton);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(() => event.target.value);
  };

  const filteredItems = visibleItems.filter(({ product }) => {
    const query = searchQuery.toLowerCase().trim();
    const productName = product.name.toLowerCase();

    return productName.includes(query);
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': activeUser === allUsersButton })}
                onClick={() => {
                  setActiveUser(allUsersButton);
                  setVisibleItems(itemList);
                }}
              >
                {allUsersButton}
              </a>

              {usersFromServer.map(({
                id,
                name,
              }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={id}
                  className={cn({ 'is-active': activeUser === name })}
                  onClick={() => {
                    setActiveUser(name);
                    setVisibleItems([...itemList
                      .filter(item => item.user?.name === name)]);
                  }}
                >
                  {name}
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
                  value={searchQuery}
                  onChange={(event) => handleSearchQuery(event)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
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

              {
                categoriesFromServer.map(({
                  id,
                  title,
                }) => (
                  <a
                    data-cy="Category"
                    className={cn('button mr-2 my-1', { 'is-info': true })}
                    href="#/"
                    key={id}
                  >
                    {title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredItems.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!!filteredItems.length && (
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
                {filteredItems.map(({
                  product,
                  category,
                  user,
                }) => (
                  <tr
                    data-cy="Product"
                    key={product.id}
                  >
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${category?.icon} - ${category?.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn(
                        { 'has-text-link': user?.sex === 'm' },
                        { 'has-text-danger': user?.sex === 'f' },
                      )}
                    >
                      {user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

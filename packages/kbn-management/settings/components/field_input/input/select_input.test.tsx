/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SelectInput, SelectInputProps } from './select_input';
import { TEST_SUBJ_PREFIX_FIELD } from '.';
import { wrap } from '../mocks';

const name = 'Some select field';
const id = 'some:select:field';

describe('SelectInput', () => {
  const defaultProps = {
    id,
    name,
    ariaLabel: 'Test',
    onChange: jest.fn(),
    optionLabels: {
      option1: 'Option 1',
      option2: 'Option 2',
      option3: 'Option 3',
    },
    optionValues: ['option1', 'option2', 'option3'],
    value: 'option2',
  };

  it('renders without errors', () => {
    const { container } = render(wrap(<SelectInput {...defaultProps} />));
    expect(container).toBeInTheDocument();
  });

  it('renders the value prop', () => {
    const { getByTestId } = render(wrap(<SelectInput {...defaultProps} />));
    const input = getByTestId(`${TEST_SUBJ_PREFIX_FIELD}-${id}`);
    expect(input).toHaveValue('option2');
  });

  it('calls the onChange prop when the value changes', () => {
    const { getByTestId } = render(wrap(<SelectInput {...defaultProps} />));
    const input = getByTestId(`${TEST_SUBJ_PREFIX_FIELD}-${id}`);
    fireEvent.change(input, { target: { value: 'option3' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith({ value: 'option3' });
  });

  it('disables the input when isDisabled prop is true', () => {
    const { getByTestId } = render(wrap(<SelectInput {...defaultProps} isDisabled />));
    const input = getByTestId(`${TEST_SUBJ_PREFIX_FIELD}-${id}`);
    expect(input).toBeDisabled();
  });

  it('throws when optionValues is not provided', () => {
    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    const props = {
      ...defaultProps,
      optionLabels: undefined as any,
      optionValues: [],
    } as SelectInputProps;

    expect(() => render(wrap(<SelectInput {...props} />))).toThrowError(
      'non-empty `optionValues` are required for `SelectInput`.'
    );
    consoleMock.mockRestore();
  });

  it('recovers if optionLabel is missing', () => {
    const props = {
      ...defaultProps,
      optionLabels: {},
    } as SelectInputProps;
    const { container } = render(wrap(<SelectInput {...props} />));

    expect(container).toBeInTheDocument();
  });

  it('recovers if value is null', () => {
    const props = {
      ...defaultProps,
      value: null,
    } as SelectInputProps;
    const { container } = render(wrap(<SelectInput {...props} />));

    expect(container).toBeInTheDocument();
  });
});

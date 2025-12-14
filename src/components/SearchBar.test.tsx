import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders correctly', () => {
        render(<SearchBar value="" onChange={() => { }} />);
        expect(screen.getByPlaceholderText('Search products by name, description, or tags...')).toBeInTheDocument();
    });

    it('displays the correct value', () => {
        render(<SearchBar value="test query" onChange={() => { }} />);
        expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
    });

    it('calls onChange after debounce delay', () => {
        const handleChange = jest.fn();
        render(<SearchBar value="" onChange={handleChange} />);

        const input = screen.getByPlaceholderText('Search products by name, description, or tags...');
        fireEvent.change(input, { target: { value: 'new query' } });

        // Should not be called immediately
        expect(handleChange).not.toHaveBeenCalled();

        // Fast-forward time
        jest.advanceTimersByTime(800);

        expect(handleChange).toHaveBeenCalledWith('new query');
    });
});

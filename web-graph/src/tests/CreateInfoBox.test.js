// Import necessary libraries
import { render, screen } from '@testing-library/react';
import createInfoBox from '../components/CreateInfoBox';

describe('createInfoBox', () => {
  
  test('renders the title correctly', () => {
    const title = 'Test Title';
    const singleLineText = 'Single Line Text';
    const multilineText = 'This is the first line.\nThis is the second line.';
    
    render(createInfoBox(title, singleLineText, multilineText));
    const titleElement = screen.getByText(title);
    
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle({
      fontSize: '16px',
      fontWeight: 'bold',
      borderBottom: '1px solid black',
    });
  });
  
  test('renders the single-line text correctly', () => {
    const title = 'Test Title';
    const singleLineText = 'This is a single line of text';
    const multilineText = 'This is some multiline text.';
    
    render(createInfoBox(title, singleLineText, multilineText));
    const singleLineTextElement = screen.getByText(singleLineText);
    
    expect(singleLineTextElement).toBeInTheDocument();
    expect(singleLineTextElement).toHaveStyle({
      color: 'blue',
      fontSize: '14px',
    });
  });
  
  test('renders the multiline text correctly', () => {
    const title = 'Test Title';
    const singleLineText = 'Single Line Text';
    const multilineText = 'Line 1\nLine 2\nLine 3';
    
    render(createInfoBox(title, singleLineText, multilineText));
    
    multilineText.split('\n').forEach((line) => {
        const multilineTextElement = screen.getByText((content, element) => {
            return content.includes('Line 1') && content.includes('Line 2') && content.includes('Line 3');
          });          
      expect(multilineTextElement).toBeInTheDocument();
    });
  });
  
  test('applies the correct container styles', () => {
    const title = 'Test Title';
    const singleLineText = 'Single Line Text';
    const multilineText = 'Line 1\nLine 2\nLine 3';
    
    const { container } = render(createInfoBox(title, singleLineText, multilineText));
    
    const infoBoxElement = container.firstChild;
    expect(infoBoxElement).toHaveStyle({
      position: 'absolute',
      background: 'white',
      border: '2px solid black',
      borderRadius: '10px',
      padding: '10px',
      width: '200px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    });
  });
  
  test('renders the component with the correct text alignment', () => {
    const title = 'Test Title';
    const singleLineText = 'Single Line Text';
    const multilineText = 'Line 1\nLine 2';
    
    const { container } = render(createInfoBox(title, singleLineText, multilineText));
    
    const infoBoxElement = container.firstChild;
    expect(infoBoxElement).toHaveStyle({
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    });
  });
});

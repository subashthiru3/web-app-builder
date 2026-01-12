export const MWLButtonPropFields = [
  { key: 'type', type: 'select', options: ['icon', 'normal'] },
  { key: 'variant', type: 'select', options: ['text', 'outlined', 'contained'] },
  { key: 'color', type: 'select', options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'] },
  { key: 'text', type: 'text' },
  { key: 'className', type: 'text' },
  { key: 'disabled', type: 'checkbox' },
  { key: 'size', type: 'select', options: ['small', 'medium', 'large'] },
  { key: 'count', type: 'number' },
  { key: 'orientation', type: 'select', options: ['horizontal', 'vertical'] },
  { key: 'href', type: 'text' },
  { key: 'borderRadius', type: 'number' },
  { key: 'textTransform', type: 'select', options: ['none', 'capitalize', 'uppercase', 'lowercase'] },
  { key: 'dataTestid', type: 'text' },
  { key: 'loading', type: 'checkbox' },
  { key: 'loadingPosition', type: 'select', options: ['start', 'end', 'center'] },
  { key: 'loadingText', type: 'text' }
];

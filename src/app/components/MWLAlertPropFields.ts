export const MWLAlertPropFields = [
  { key: 'severity', type: 'select', options: ['error', 'warning', 'info', 'success'] },
  { key: 'title', type: 'text' },
  { key: 'message', type: 'text' },
  { key: 'variant', type: 'select', options: ['filled', 'outlined', 'standard'] },
  { key: 'onClose', type: 'checkbox' },
];

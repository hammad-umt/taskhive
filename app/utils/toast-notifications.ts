import { toast } from 'sonner';

/**
 * Enhanced toast notifications with consistent styling and messaging
 */

export const toastNotifications = {
  // Success messages
  success: {
    created: (item: string) => toast.success(`${item} created successfully!`),
    updated: (item: string) => toast.success(`${item} updated successfully!`),
    deleted: (item: string) => toast.success(`${item} deleted successfully!`),
    saved: () => toast.success('Changes saved successfully!'),
    generic: (message: string) => toast.success(message),
  },

  // Error messages
  error: {
    fetchFailed: (item: string) => toast.error(`Failed to fetch ${item}`),
    createFailed: (item: string) => toast.error(`Failed to create ${item}`),
    updateFailed: (item: string) => toast.error(`Failed to update ${item}`),
    deleteFailed: (item: string) => toast.error(`Failed to delete ${item}`),
    validation: (message: string) => toast.error(`Validation error: ${message}`),
    network: () => toast.error('Network error. Please try again.'),
    generic: (message: string) => toast.error(message),
  },

  // Info messages
  info: {
    loading: (message: string) => toast.loading(message),
    processing: (message: string) => toast.loading(message),
    generic: (message: string) => toast.info(message),
  },

  // Warning messages
  warning: {
    unsavedChanges: () => toast.warning('You have unsaved changes'),
    confirmDelete: (item: string) => toast.warning(`Are you sure you want to delete ${item}?`),
    generic: (message: string) => toast.warning(message),
  },

  // Promise-based toasts
  promise: async (
    promise: Promise<unknown>,
    messages: { loading: string; success: string; error: string }
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toast.promise(promise as Promise<any>, messages);
  },
};

/**
 * Common toast patterns
 */
export const commonToasts = {
  // Data fetching
  fetchingData: () => toast.loading('Loading data...'),
  fetchingDataCompleted: (dismissId: string | number) => toast.dismiss(dismissId),

  // Form submission
  submittingForm: () => toast.loading('Submitting form...'),
  formSubmitted: (dismissId: string | number) => {
    toast.dismiss(dismissId);
    toast.success('Form submitted successfully!');
  },
  formSubmissionFailed: (dismissId: string | number, error?: string) => {
    toast.dismiss(dismissId);
    toast.error(error || 'Form submission failed. Please try again.');
  },

  // Deletion
  confirmingDeletion: (item: string) => {
    toast.warning(`Deleting ${item}...`);
  },
  deletionConfirmed: () => {
    toast.success('Item deleted successfully');
  },
  deletionCancelled: () => {
    toast.info('Deletion cancelled');
  },

  // Search
  searching: () => toast.loading('Searching...'),
  noResults: () => toast.info('No results found'),
  searchCompleted: () => toast.dismiss(),

  // Navigation
  navigationSuccess: (destination: string) => toast.info(`Navigating to ${destination}`),

  // Permissions
  noPermission: () => toast.error('You do not have permission to perform this action'),
  sessionExpired: () => toast.error('Your session has expired. Please login again.'),

  // Copy to clipboard
  copiedToClipboard: () => toast.success('Copied to clipboard'),
};

export const mockToast = {
  toast: jest.fn(),
  dismiss: jest.fn(),
};

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => mockToast
}));
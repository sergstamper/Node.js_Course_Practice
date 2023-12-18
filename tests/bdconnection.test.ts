import connectToDatabase from '../src/bdconnection';

describe('connectToDatabase', () => {
  it('should log an error message on connection error', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    await connectToDatabase();

    expect(async () => {
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error connection to MongoDB Atlas:',
        expect.any(Error)
      );
    })

    mockConsoleError.mockRestore();
  });
});
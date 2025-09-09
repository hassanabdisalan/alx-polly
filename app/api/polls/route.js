/**
 * Handles poll creation and retrieval
 * @param {Request} req - Next.js API request
 * @returns {Promise<Response>} JSON response
 */
export async function POST(req) {
    try {
        const data = await req.json();
        const { user } = await getServerSession();
        
        if (!user) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const poll = await createPoll(data, user.id);
        return Response.json(poll);
    } catch (error) {
        return Response.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
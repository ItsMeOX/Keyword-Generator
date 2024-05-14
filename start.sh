cd "$(dirname "$0")"
echo "Starting Next.js development server..."
npm run dev &
echo "Opening localhost in web browser..."
open "http://localhost:3000"
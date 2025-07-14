export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      <p className="mb-4">
        Si vous avez des questions, des commentaires ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes là pour vous aider !
      </p>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
          <input type="text" id="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Envoyer</button>
      </form>
    </div>
  );
}

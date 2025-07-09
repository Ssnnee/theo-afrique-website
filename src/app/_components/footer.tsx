export function Footer() {
  return (
    <footer className="">
      <div className="container mx-auto text-center border-t py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Theo Afrique . Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

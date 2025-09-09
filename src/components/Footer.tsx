import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-6 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Drone Depot</p>
          <p className="mt-2 sm:mt-0">Gated RFP Desk · Concierge Matching · Resource Hub</p>
        </div>
      </Container>
    </footer>
  );
}

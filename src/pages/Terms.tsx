
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              Please read these terms of service carefully before using Nexaconnect.
            </p>
            
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
            </p>
            
            <h2>Description of Service</h2>
            <p>
              Nexaconnect provides a platform for users to connect with others via video and text chat. Users are randomly matched with other users from around the world.
            </p>
            
            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            
            <h2>Acceptable Use Policy</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Share content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Collect or store personal data about other users without their consent</li>
              <li>Engage in any activity that could harm minors</li>
            </ul>
            
            <h2>Content Policy</h2>
            <p>
              Users are solely responsible for the content they share. We do not claim ownership of your content, but you grant us a license to use, store, and share your content in connection with providing the service.
            </p>
            
            <h2>Termination</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Nexaconnect, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
            
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;

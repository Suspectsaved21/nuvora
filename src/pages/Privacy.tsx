
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              At Nuvora, we are committed to protecting your privacy and ensuring you have a positive experience on our website.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users and to improve the quality of our platform. The types of information we collect include:
            </p>
            <ul>
              <li>Account information: When you create an account, we collect your email address and a password.</li>
              <li>Usage data: We collect data about how you use our service, such as when you use the platform, features you use, and how you interact with others.</li>
              <li>Content: We temporarily process the content of your communications to enable your conversations.</li>
              <li>Technical data: We collect information about your device, browser, IP address, and other technical information.</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Understand how users use our services</li>
              <li>Monitor and prevent misuse of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>Data Storage and Security</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. However, no internet transmission is completely secure, and we cannot guarantee that unauthorized access, hacking, data loss, or other breaches will never occur.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us.
            </p>
            
            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our practices, please contact us.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;

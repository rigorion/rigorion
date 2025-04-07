import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">About Personality Arc</h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section className="prose lg:prose-lg">
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to Personality Arc, where we believe in the power of understanding ourselves 
                and others through the lens of personality science. Our mission is to help people 
                discover their unique personality traits and use that knowledge to improve their 
                lives and relationships.
              </p>
            </section>

            <section className="grid md:grid-cols-3 gap-8 py-12">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-600">Empowering individuals through personality insights</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-gray-600">Creating a world where everyone understands themselves better</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                <p className="text-gray-600">Authenticity, Growth, and Community</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
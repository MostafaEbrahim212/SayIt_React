import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary shadow-md mt-8 md:mt-12">
            <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 text-center md:text-left">
                    
                    {/* Left: Copyright */}
                    <div className="text-xs md:text-sm text-gray-600 order-1 md:order-1">
                        <p>&copy; {currentYear} SayIt. {t('footer.allRightsReserved')}</p>
                    </div>

                    {/* Center: Website Maker */}
                    <div className="text-xs md:text-sm text-gray-600 order-3 md:order-2">
                        <p>Made with ❤️ by <span className="font-semibold">Mostafa Ebrahim</span></p>
                    </div>

                    {/* Right: Technologies */}
                    <div className="text-xs md:text-sm text-gray-600 order-2 md:order-3">
                        <p>React • Tailwind CSS • Node.js</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}
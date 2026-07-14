import React from 'react';
import { Link } from 'react-router-dom';
import LogoImage from '../assets/logo/logo-dark.svg';
import Button from './Button';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

// Define the type for menuItems
interface MenuSection {
	title: string;
	items: string[];
}

const menuItems: Record<string, MenuSection> = {
	sandwych: {
		title: 'Sandwych',
		items: ['Features', 'About', 'Download for iOS', 'Download for Android'],
	},
	resources: {
		title: 'Resources',
		items: ['CareCost Map®', 'The Resource Stack', 'FAQs'],
	},
	providers: {
		title: 'Providers',
		items: ['Why Integrate Sandwych?', 'How it Works', 'Schedule a Demo'],
	},
	patients: {
		title: 'Patients & Care Partners',
		items: ['Why Use Sandwych?', 'How it Works', 'Caregiving Typology Quiz'],
	},
	localService: {
		title: 'Local Service Providers',
		items: ['Why Partner with Sandwych?', 'How it Works', 'Manage Your Listing', 'Schedule a Demo'],
	},
};

const Footer: React.FC = () => {
	return (
		<footer className="bg-primary-navy text-white py-8 md:py-12 px-4 md:px-6">
			<div className="container mx-auto">
				{/* Logo Section */}
				<div className="mb-8 flex justify-center md:justify-start">
					<img
						src={LogoImage}
						alt="Sandwych"
						className="h-[32px] w-[224px] md:h-[41px] md:w-[288px]"
					/>
				</div>

				{/* Navigation Grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
					{Object.entries(menuItems).map(([key, section]) => (
						<div key={key} className="col-span-1">
							<h3 className="text-body-bold mb-4">{section.title}</h3>
							<ul className="space-y-2">
								{section.items.map((item, index) => (
									<li key={index}>
										<Link to="#" className="text-body text-white hover:text-primary-orange">
											{item}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
					<div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-4">
						<Button type="submit" variant="primary" fullWidth>
							Contact
						</Button>
						<Button type="submit" variant="outline" fullWidth>
							Join the Waitlist
						</Button>
						<Link to="/login" className="text-primary-orange text-center text-body-bold underline">
							Log in
						</Link>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/20 gap-4">
					<div className="flex flex-wrap justify-center md:justify-start gap-4">
						<span className="text-body">©Copyright 2025 Sandwych</span>
						<span className="hidden md:inline">|</span>
						<Link to="/terms" className="text-body text-white">
							Terms & Conditions
						</Link>
						<span className="hidden md:inline">|</span>
						<Link to="/privacy" className="text-body text-white">
							Privacy Policy
						</Link>
						<span className="hidden md:inline">|</span>
						<Link to="/hipaa" className="text-body text-white">
							HIPAA Policy
						</Link>
					</div>

					<div className="flex flex-col md:flex-row items-center gap-4">
						<span className="text-body">Follow us:</span>
						<div className="flex gap-6">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary-orange"
							>
								<FaFacebookF size={24} className="text-neutral-grey md:text-[28px]" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary-orange"
							>
								<FaInstagram size={24} className="text-neutral-grey md:text-[28px]" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary-orange"
							>
								<FaLinkedinIn size={24} className="text-neutral-grey md:text-[28px]" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

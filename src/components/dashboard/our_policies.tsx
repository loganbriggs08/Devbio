'use client'
import { useRouter } from 'next/navigation';
import styles from './policies.module.css';

export const OurPolicies: React.FC = () => {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Our Policies</h1>
            <div className={styles.text}>
                By accessing or using DevBio.me, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you may not access the service.
                <br/>
                <br/>
                1. Account Registration and Security
                You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password, whether your password is with our service or a third-party service.
                <br/>
                <br/>
                2. Developer Bio Content
                You are solely responsible for the content you publish on our platform. You agree that you will not upload, post, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.
                <br/>
                <br/>
                3. Service Modification and Termination
                We reserve the right to modify, suspend, or terminate the service, or any part of it, at any time and for any reason without notice. You agree that we shall not be liable to you or any third party for any modification, suspension, or termination of the service.
                <br/>
                <br/>
                4. Intellectual Property Rights
                You acknowledge and agree that we own all legal right, title, and interest in and to the service, including any intellectual property rights that subsist in the service. You agree not to reproduce, duplicate, copy, sell, trade, resell, or exploit for any commercial purposes any portion of the service.
                <br/>
                <br/>
                5. Limitation of Liability
                In no event shall DevBio.me, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                <br/>
                <br/>
                6. Governing Law
                These Terms shall be governed and construed in accordance with the laws of the EU, without regard to its conflict of law provisions.
                <br/>
                <br/>
                7. Changes to Terms of Service
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                <br/>
                <br/>
                8. Protection Against Malicious Activities
                You agree not to engage in any activity that interferes with or disrupts the service or networks connected to the service. Any violation of this provision may result in immediate termination of your access to the service and may subject you to legal consequences.
                <br/>
                <br/>
                9. Legal Action and Copyright Violation
                In the event of any attempt to disrupt the service, including but not limited to DDoS attacks, or in the case of copyright infringement, we reserve the right to pursue legal action against you. DevBio.me maintains a team of 50 legal professionals to address such issues, and any violation of copyright or malicious activity will be dealt with to the fullest extent of the law.
                <br/>
                <br/>
                <br/>
                <br/>
                Note ** You automatically agree to these terms when registering an account with DevBio.me
            </div>
        </div>
    );
}; 

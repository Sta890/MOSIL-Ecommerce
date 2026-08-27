import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {API_URL} from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class LoginNotificationService {

  constructor(private http: HttpClient) {}

  async sendLoginNotification(email: string, firstName: string) {
    const now = new Date();
    const time = now.toLocaleString('fr-FR', { timeZone: 'Africa/Douala' });

    // Récupérer l'IP publique
    let ip = 'Inconnue';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      ip = data.ip;
    } catch {}

    const userAgent = navigator.userAgent;
    const device = this.parseDevice(userAgent);

    const emailBody = `
      <h2>🔐 Nouvelle connexion détectée</h2>
      <p>Bonjour <strong>${firstName}</strong>,</p>
      <p>Une connexion à votre compte a été effectuée :</p>
      <table style="border-collapse:collapse; width:100%">
        <tr><td style="padding:8px; border:1px solid #ddd"><strong>📧 Email</strong></td><td style="padding:8px; border:1px solid #ddd">${email}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd"><strong>🕐 Heure</strong></td><td style="padding:8px; border:1px solid #ddd">${time}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd"><strong>🌐 Adresse IP</strong></td><td style="padding:8px; border:1px solid #ddd">${ip}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd"><strong>💻 Appareil</strong></td><td style="padding:8px; border:1px solid #ddd">${device}</td></tr>
      </table>
      <p style="color:#888; font-size:12px">Si ce n'était pas vous, changez votre mot de passe immédiatement.</p>
    `;

    // Appel à votre backend qui relaie vers Gmail API
    return this.http.post(`${API_URL}/notify/login`, {
      to: email,
      firstName: firstName,
      ip: ip,
      device: device,
      time: time
    }).subscribe({
      next: () => console.log('📧 Notification envoyée'),
      error: (err) => console.warn('Notification non envoyée:', err)
    });
  }

  private parseDevice(ua: string): string {
    if (/mobile/i.test(ua)) return '📱 Mobile';
    if (/tablet/i.test(ua)) return '📱 Tablette';
    return '💻 Desktop';
  }
}

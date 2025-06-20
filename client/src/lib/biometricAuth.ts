
export interface BiometricCredential {
  id: string;
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    attestationObject: ArrayBuffer;
  };
  type: string;
}

export class BiometricAuth {
  private static isSupported(): boolean {
    return window.PublicKeyCredential !== undefined;
  }

  static async isAvailable(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  static async register(userId: string, username: string): Promise<BiometricCredential | null> {
    if (!this.isSupported()) {
      throw new Error('Биометрическая аутентификация не поддерживается');
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "SteroidTracker",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: "direct",
        },
      }) as PublicKeyCredential;

      if (!credential) {
        return null;
      }

      return {
        id: credential.id,
        rawId: credential.rawId,
        response: {
          clientDataJSON: (credential.response as AuthenticatorAttestationResponse).clientDataJSON,
          attestationObject: (credential.response as AuthenticatorAttestationResponse).attestationObject,
        },
        type: credential.type,
      };
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw new Error('Не удалось зарегистрировать биометрию');
    }
  }

  static async authenticate(credentialId: string): Promise<BiometricCredential | null> {
    if (!this.isSupported()) {
      throw new Error('Биометрическая аутентификация не поддерживается');
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            {
              id: this.base64ToArrayBuffer(credentialId),
              type: "public-key",
            },
          ],
          userVerification: "required",
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      if (!credential) {
        return null;
      }

      return {
        id: credential.id,
        rawId: credential.rawId,
        response: {
          clientDataJSON: (credential.response as AuthenticatorAssertionResponse).clientDataJSON,
          attestationObject: (credential.response as AuthenticatorAssertionResponse).signature,
        },
        type: credential.type,
      };
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw new Error('Биометрическая аутентификация не удалась');
    }
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

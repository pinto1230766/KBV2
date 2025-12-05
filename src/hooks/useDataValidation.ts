import { useCallback } from 'react';
import { validateSpeaker, validateVisit, validateHost } from '@/utils/validation';
import { Speaker, Visit, Host } from '@/types';

export function useDataValidation() {
  const validateSpeakerData = useCallback((speaker: Partial<Speaker>) => {
    return validateSpeaker(speaker);
  }, []);

  const validateVisitData = useCallback((visit: Partial<Visit>) => {
    return validateVisit(visit);
  }, []);

  const validateHostData = useCallback((host: Partial<Host>) => {
    return validateHost(host);
  }, []);

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePhone = useCallback((phone: string) => {
    // Accepte les formats internationaux et locaux
    const phoneRegex = /^(\+|00)?[0-9\s-]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }, []);

  return {
    validateSpeaker: validateSpeakerData,
    validateVisit: validateVisitData,
    validateHost: validateHostData,
    validateEmail,
    validatePhone
  };
}

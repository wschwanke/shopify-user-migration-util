class Migrate {
  private stats = {
    invalidEmails: 0,
    invalidNames: 0,
    totalRecords: 0,
  };

  public isValidEmail(email: string) {
    const emailRegExp = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const regExpResults = email.match(emailRegExp);

    if (regExpResults !== null && regExpResults.length === 1) {
      return true;
    }
    return false;
  }

  public stripPhone(phone: string) {
    const phoneTrim = phone.trim();
    const phoneStripped = phoneTrim.replace(/[^\d]/g, '');
    if (phoneStripped.length > 10 && phoneStripped.indexOf('+') === -1 ) {
      return `+${phoneStripped}`;
    }
    return phoneStripped;
  }

  public isValidCountryISO() {
    return true;
  }

  public isValidProvinceISO() {
    return true;
  }

  public getStats() {
    return this.stats;
  }
}

export { Migrate };

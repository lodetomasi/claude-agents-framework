import { Agent } from './Agent';
import { 
  AgentConfig, 
  AgentMetadataSchema, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning 
} from '../types';
import { ZodError } from 'zod';

/**
 * Validates agent configurations
 */
export class AgentValidator {
  private readonly MAX_CONTENT_LENGTH = 10000;
  private readonly MIN_CONTENT_LENGTH = 50;
  private readonly RESERVED_NAMES = [
    'help', 'test', 'debug', 'admin', 'root', 'system', 'claude'
  ];

  /**
   * Validate agent configuration
   */
  async validate(config: AgentConfig): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate metadata
    try {
      AgentMetadataSchema.parse(config.metadata);
    } catch (error) {
      if (error instanceof ZodError) {
        errors.push(...this.zodErrorsToValidationErrors(error));
      }
    }

    // Validate name
    const nameValidation = this.validateName(config.metadata.name);
    errors.push(...nameValidation.errors);
    warnings.push(...nameValidation.warnings);

    // Validate content
    const contentValidation = this.validateContent(config.content);
    errors.push(...contentValidation.errors);
    warnings.push(...contentValidation.warnings);

    // Validate description
    const descValidation = this.validateDescription(config.metadata.description);
    errors.push(...descValidation.errors);
    warnings.push(...descValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate existing agent
   */
  async validateAgent(agent: Agent): Promise<ValidationResult> {
    return this.validate({
      metadata: agent.metadata,
      content: agent.content
    });
  }

  /**
   * Validate agent name
   */
  private validateName(name: string): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check reserved names
    if (this.RESERVED_NAMES.includes(name.toLowerCase())) {
      errors.push({
        field: 'name',
        message: `Name '${name}' is reserved and cannot be used`,
        severity: 'error'
      });
    }

    // Check name format
    if (!/^[a-z0-9-]+$/.test(name)) {
      errors.push({
        field: 'name',
        message: 'Name must contain only lowercase letters, numbers, and hyphens',
        severity: 'error'
      });
    }

    // Check name length
    if (name.length < 3) {
      errors.push({
        field: 'name',
        message: 'Name must be at least 3 characters long',
        severity: 'error'
      });
    }

    if (name.length > 50) {
      errors.push({
        field: 'name',
        message: 'Name must not exceed 50 characters',
        severity: 'error'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate agent content
   */
  private validateContent(content: string): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check content length
    if (content.length < this.MIN_CONTENT_LENGTH) {
      errors.push({
        field: 'content',
        message: `Content must be at least ${this.MIN_CONTENT_LENGTH} characters`,
        severity: 'error'
      });
    }

    if (content.length > this.MAX_CONTENT_LENGTH) {
      warnings.push({
        field: 'content',
        message: `Content exceeds recommended length of ${this.MAX_CONTENT_LENGTH} characters`,
        severity: 'warning'
      });
    }

    // Check for required sections
    if (!content.includes('##')) {
      warnings.push({
        field: 'content',
        message: 'Content should include section headers (##) for better organization',
        severity: 'warning'
      });
    }

    // Check for examples
    if (!content.toLowerCase().includes('example')) {
      warnings.push({
        field: 'content',
        message: 'Consider adding examples to help users understand the agent',
        severity: 'warning'
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate agent description
   */
  private validateDescription(description: string): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check description quality
    if (description.split(' ').length < 5) {
      warnings.push({
        field: 'description',
        message: 'Description is too short. Consider adding more detail',
        severity: 'warning'
      });
    }

    // Check for action words
    const actionWords = ['build', 'create', 'analyze', 'optimize', 'help', 'assist', 'generate'];
    const hasActionWord = actionWords.some(word => 
      description.toLowerCase().includes(word)
    );

    if (!hasActionWord) {
      warnings.push({
        field: 'description',
        message: 'Description should include action words to clarify agent capabilities',
        severity: 'warning'
      });
    }

    return { errors, warnings };
  }

  /**
   * Convert Zod errors to validation errors
   */
  private zodErrorsToValidationErrors(zodError: ZodError): ValidationError[] {
    return zodError.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
      severity: 'error' as const
    }));
  }

  /**
   * Auto-fix common issues
   */
  async autoFix(config: AgentConfig): Promise<AgentConfig> {
    const fixed = { ...config };

    // Fix name format
    fixed.metadata.name = fixed.metadata.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');

    // Add default version if missing
    if (!fixed.metadata.version) {
      fixed.metadata.version = '1.0.0';
    }

    // Trim whitespace
    fixed.content = fixed.content.trim();
    fixed.metadata.description = fixed.metadata.description.trim();

    return fixed;
  }
}
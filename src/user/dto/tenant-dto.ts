// dto/tenant.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TenantDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  flatId?: number;
}

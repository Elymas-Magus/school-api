import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { ListSubjectsByPeriod } from "./dto/list-subjects-by-period.dto";
import { SubjectFilter } from "./dto/subject-filter.dto";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { Subject } from "./entities/subject.entity";
import { SubjectRepository } from "./subject.repository";

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepo: SubjectRepository) {}
  create(CreateSubjectDto: CreateSubjectDto): Subject {
    // const name = CreateSubjectDto.name;

    // const SubjectExists = this.subjectRepo.findOne({
    //   where: { name },
    // });

    // if (SubjectExists != null)
    //   throw new HttpException(
    //     `This subject with name ${name} already exists`,
    //     HttpStatus.BAD_REQUEST
    //   );

    const subject = new Subject();
    subject.name = CreateSubjectDto.name;
    subject.period = CreateSubjectDto.period;
    subject.goal = CreateSubjectDto.goal;
    subject.ch_total = CreateSubjectDto.ch_total;
    subject.curriculum = CreateSubjectDto.curriculum;
    subject.createdAt = new Date();

    this.subjectRepo.create(subject);

    this.subjectRepo.save(subject);

    return subject;
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectRepo.find();
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepo.findOne({ where: { id } });

    if (subject == null)
      throw new HttpException("Subject not found", HttpStatus.NOT_FOUND);

    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepo.findOne({ where: { id } });

    if (subject == null)
      throw new HttpException("Subject not found", HttpStatus.NOT_FOUND);

    subject.name = updateSubjectDto.name;
    subject.period = updateSubjectDto.period;
    subject.goal = updateSubjectDto.goal;
    subject.ch_total = updateSubjectDto.ch_total;
    subject.curriculum = updateSubjectDto.curriculum;
    subject.createdAt = new Date();

    this.subjectRepo.update(id, subject);

    this.subjectRepo.save(subject);

    return subject;
  }

  async remove(id: number): Promise<string> {
    const subject = await this.subjectRepo.findOne({ where: { id } });

    if (subject == null)
      throw new HttpException("Subject not found", HttpStatus.NOT_FOUND);

    subject.deletedAt = new Date();

    this.subjectRepo.delete(subject);
    this.subjectRepo.save(subject);

    return "Deleted Successfully";
  }

  async findAllPaginated(
    params: BaseListiningRequest<SubjectFilter>
  ): Promise<BaseListiningRequestResult<Subject>> {
    const per_page = params.per_page || 10;
    const skip = params.per_page * (params.page - 1) || 0;
    const query = this.subjectRepo.createQueryBuilder("subject");

    if (params.filters.name != null)
      query.where("subject.name like :name", {
        name: params.filters.name,
      });

    if (params.filters.goal != null)
      query.where("subject.goal like :goal", { goal: params.filters.goal });

    if (params.filters.ch_total != null)
      query.where("subject.ch_total = :ch_total", {
        ch_total: params.filters.ch_total,
      });

    if (params.filters.period != null)
      query.where("subject.period = :period", {
        period: params.filters.period,
      });

    if (params.orderBy != null)
      query.orderBy(params.orderBy, params.orderDirection);

    const total = await query.getCount();
    const num_pages = Math.ceil(total / per_page);
    const data = await query.skip(skip).take(per_page).getMany();
    const next_page = num_pages > params.page;
    const prev_page = params.page > 1;

    return new BaseListiningRequestResult<Subject>(
      data,
      params.page,
      per_page,
      num_pages,
      next_page,
      prev_page
    );
  }

  async findByPeriod(period: number): Promise<Subject[]> {
    const subjects = await this.subjectRepo.findBy({ period });
    if (subjects == null)
      throw new HttpException("Subject not found", HttpStatus.NOT_FOUND);
    return subjects;
  }

  async findAndGroupByPeriod(): Promise<ListSubjectsByPeriod[]> {
    const subjects = await this.subjectRepo.find();

    if (subjects == null)
      throw new HttpException("Subject not found", HttpStatus.NOT_FOUND);

    const subjectsByPeriod = new Array<ListSubjectsByPeriod>();

    let periods = subjects.map((x) => x.period);
    periods = [...new Set(periods)];
    periods.sort();

    periods.forEach((periodNumber) => {
      const filteredSubjects = subjects.filter(
        (x) => x.period === periodNumber
      );

      subjectsByPeriod.push(
        new ListSubjectsByPeriod(periodNumber, filteredSubjects)
      );
    });

    return subjectsByPeriod;
  }
}

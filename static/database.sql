CREATE TABLE IF NOT EXISTS `department`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) UNIQUE,
    PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `role`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30),
    `salary` DECIMAL(13, 2),
    `department_id` INT,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`department_id`) REFERENCES `department`(`id`),
    UNIQUE KEY `title_department` (`title`, `department_id`)
);
CREATE TABLE IF NOT EXISTS `employee`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30),
    `last_name` VARCHAR(30),
    `role_id` INT REFERENCES `role`(`id`),
    `manager_id` INT DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`),
    FOREIGN KEY (`manager_id`) REFERENCES `employee`(`id`)
);